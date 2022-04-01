from datetime import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    ForeignKey,
    PositiveIntegerField,
    TextField,
    CASCADE,
    RESTRICT,
)

from fantasion_generics.models import PublicModel
from fantasion_generics.media import MediaParentField, MediaModelMixin
from fantasion_generics.photos import PrivatePhotoModel
from fantasion_eshop.models import OrderItem


class Participant(TimeStampedModel):
    class Meta:
        verbose_name = _("Participant")
        verbose_name_plural = _("Participants")

    name = CharField(
        max_length=255,
        verbose_name=_("Name"),
    )
    birthdate = DateField(verbose_name=_("Birth date"))

    def __str__(self):
        return f"{self.name} ({self.birthdate})"


SIGNUP_STATUS_NEW = 1
SIGNUP_STATUS_CONFIRMED = 2
SIGNUP_STATUS_DOWN_PAYMENT_PAID = 3
SIGNUP_STATUS_PAID = 4
SIGNUP_STATUS_CANCELLED = 5

SIGNUP_STATES = (
    (SIGNUP_STATUS_NEW, _("New")),
    (SIGNUP_STATUS_CONFIRMED, _("Confirmed")),
    (SIGNUP_STATUS_DOWN_PAYMENT_PAID, _("Down payment paid")),
    (SIGNUP_STATUS_PAID, _("Paid")),
    (SIGNUP_STATUS_CANCELLED, _("Cancelled")),
)


class Signup(OrderItem):
    class Meta:
        verbose_name = _("Signup")
        verbose_name_plural = _("Signups")

    family = ForeignKey(
        "fantasion_people.Family",
        on_delete=RESTRICT,
        related_name="signups",
        verbose_name=_("Family"),
    )
    batch_age_group = ForeignKey(
        "fantasion_expeditions.Troop",
        on_delete=RESTRICT,
        related_name="signups",
        verbose_name=_("Age Group"),
    )
    participant = ForeignKey(
        Participant,
        on_delete=RESTRICT,
        related_name="signups",
        verbose_name=_("Participant"),
    )
    legal_guardian = BooleanField(verbose_name=_("Legal Guardian"), )
    status = PositiveIntegerField(
        choices=SIGNUP_STATES,
        verbose_name=_("Signup Status"),
    )
    submitted_at = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Submitted at"),
        help_text=_("The exact date and time signup was submitted."
                    "Date is generated automatically"),
    )
    cancelled_for = TextField(
        blank=True,
        null=True,
        verbose_name=_("Cancelled for"),
        help_text=_(
            "Write down a short explanation why was this signup cancelled"),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial_status = self.status

    def get_description(self):
        return "Signup: {participant}".format(participant=self.participant)

    def was_submitted(self):
        return (self.status == SIGNUP_STATUS_CONFIRMED
                and self.status != self.initial_status)

    def clean(self):
        """
        Owner must have permission to create signups on behalf of a family
        """
        if self.family.can_user_own_order(self.order.owner):
            raise ValidationError(
                _((
                    "User {user_name} is not allowed to make signups on",
                    "behalf of Family#{family_id}.",
                )).format(
                    user_name=self.order.owner.get_full_name(),
                    family_id=self.family.id,
                ))

    def save(self, *args, **kwargs):
        """
        Must not order more than one signup! Signups are fixed to the
        participant and expedition batch. Basically, it is physically
        impossible for a person to be on one place twice.
        """
        self.amount = 1
        if not self.submitted_at and self.was_submitted():
            self.submitted_at = datetime.now()
        super().save(*args, **kwargs)


class SignupDocumentType(PublicModel):
    class Meta:
        verbose_name = _("Signup Document Type")
        verbose_name_plural = _("Signup Document Type")

    required = BooleanField(
        default=False,
        verbose_name=_("Required"),
        help_text=_("Signup will be marked as incomplete until parent uploads"
                    "this document"),
    )


class SignupDocument(TimeStampedModel):
    class Meta:
        verbose_name = _("Signup Document")
        verbose_name_plural = _("Signup Document")

    signup = ForeignKey(
        Signup,
        on_delete=CASCADE,
        related_name="documents",
        verbose_name=_("Signup"),
    )
    document_type = ForeignKey(
        SignupDocumentType,
        on_delete=RESTRICT,
        related_name="documents",
        verbose_name=_("Document type"),
    )


class SignupDocumentMedia(MediaModelMixin, PrivatePhotoModel):
    parent = MediaParentField(SignupDocument)

    @property
    def upload_dir(self):
        return "signups/{0}".format(self.parent_id)


class SignupDocumentVerification(TimeStampedModel):
    class Meta:
        verbose_name = _("Document Verification")
        verbose_name_plural = _("Document Verifications")

    document = ForeignKey(
        SignupDocument,
        on_delete=CASCADE,
        related_name="verifications",
        verbose_name=_("Signup Document"),
    )
    verified_by = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=RESTRICT,
        related_name="signup_document_verifications",
        verbose_name=_("Verified by"),
    )
    verified_on = DateField(
        verbose_name=_("Verified on"),
        help_text=_("Date this document was verified"),
    )
    valid_until = DateField(
        verbose_name=_("Valid until"),
        help_text=_("This document will stay valid until it expires"),
    )
