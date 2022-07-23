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
from fantasion_eshop.models import (
    OrderItem,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_CONFIRMED,
    ORDER_STATUS_DISPATCHED,
    ORDER_STATUS_NEW,
    ORDER_STATUS_PAID,
    ORDER_STATUS_RESOLVED,
)

ORDER_SIGNUP_ACCEPTED = (
    ORDER_STATUS_DISPATCHED,
    ORDER_STATUS_PAID,
    ORDER_STATUS_RESOLVED,
)


class Participant(TimeStampedModel):

    class Meta:
        verbose_name = _("Participant")
        verbose_name_plural = _("Participants")

    family = ForeignKey(
        'fantasion_people.Family',
        on_delete=CASCADE,
        related_name='participants',
        verbose_name=_('Family'),
    )
    first_name = CharField(
        max_length=255,
        verbose_name=_("Given Name"),
    )
    last_name = CharField(
        max_length=255,
        verbose_name=_("Family Name"),
    )
    birthdate = DateField(verbose_name=_("Birth date"))
    no_allergies = BooleanField(
        default=False,
        verbose_name=_("Has no allergies"),
    )
    no_diets = BooleanField(
        default=False,
        verbose_name=_("Has no diets"),
    )
    no_hobbies = BooleanField(
        default=False,
        verbose_name=_("Has no hobbies"),
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.birthdate})"


class ParticipantAllergy(TimeStampedModel):

    class Meta:
        verbose_name = _("Participant Allergy")
        verbose_name_plural = _("Participant Allergies")
        unique_together = ('participant', 'allergy')

    participant = ForeignKey(
        Participant,
        on_delete=CASCADE,
        related_name="participant_allergies",
    )
    allergy = ForeignKey(
        "fantasion_people.Allergy",
        on_delete=RESTRICT,
        related_name="participant_allergies",
        verbose_name=_('Allergy'),
    )

    def __str__(self):
        return f'{self.participant}: {self.allergy}'


class ParticipantDiet(TimeStampedModel):

    class Meta:
        verbose_name = _("Participant Diet")
        verbose_name_plural = _("Participant Diets")
        unique_together = ('participant', 'diet')

    participant = ForeignKey(
        Participant,
        on_delete=CASCADE,
        related_name="participant_diets",
    )
    diet = ForeignKey(
        "fantasion_people.Diet",
        on_delete=RESTRICT,
        related_name="participant_diets",
        verbose_name=_('Diet'),
    )

    def __str__(self):
        return f'{self.participant}: {self.diet}'


class ParticipantHobby(TimeStampedModel):

    class Meta:
        verbose_name = _("Participant Hobby")
        verbose_name_plural = _("Participant Hobbies")
        unique_together = ('participant', 'hobby')

    participant = ForeignKey(
        Participant,
        on_delete=CASCADE,
        related_name="participant_hobbies",
    )
    hobby = ForeignKey(
        "fantasion_people.Hobby",
        on_delete=RESTRICT,
        related_name="participant_hobbies",
        verbose_name=_('Hobby'),
    )

    def __str__(self):
        return f'{self.participant}: {self.hobby}'


SIGNUP_STATUS_NEW = 1
SIGNUP_STATUS_CONFIRMED = 2
SIGNUP_STATUS_ACTIVE = 3
SIGNUP_STATUS_CANCELLED = 5

SIGNUP_STATES = (
    (SIGNUP_STATUS_NEW, _("New")),
    (SIGNUP_STATUS_CONFIRMED, _("Confirmed")),
    (SIGNUP_STATUS_ACTIVE, _("Active")),
    (SIGNUP_STATUS_CANCELLED, _("Cancelled")),
)


def validate_legal_guardian(value):
    if not value:
        raise ValidationError(
            _("Cannot create a signup unless you are a legal guardian"))


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
    troop = ForeignKey(
        "fantasion_expeditions.Troop",
        on_delete=RESTRICT,
        related_name="signups",
        verbose_name=_("Troop"),
    )
    participant = ForeignKey(
        Participant,
        on_delete=RESTRICT,
        related_name="signups",
        verbose_name=_("Participant"),
    )
    legal_guardian = BooleanField(
        validators=[validate_legal_guardian],
        verbose_name=_("Legal Guardian"),
    )
    status = PositiveIntegerField(
        choices=SIGNUP_STATES,
        verbose_name=_("Signup Status"),
        default=SIGNUP_STATUS_NEW,
    )
    submitted_at = DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Submitted at"),
        help_text=_("The exact date and time signup was submitted."
                    "Date is generated automatically"),
    )
    note = TextField(
        blank=True,
        null=True,
        verbose_name=_('Note'),
        help_text=_(
            'Extra information that does not fit in any of the fields'),
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
            err = ("User {user_name} is not allowed to make signups on"
                   "behalf of Family#{family_id}.")
            raise ValidationError(
                _(err).format(
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

    def recalculate(self):
        if self.status == SIGNUP_STATUS_CANCELLED:
            return
        status = self.order.status
        if status == ORDER_STATUS_NEW:
            self.status = SIGNUP_STATUS_NEW
        elif (status == ORDER_STATUS_CONFIRMED
              or status == ORDER_STATUS_DISPATCHED):
            self.status = SIGNUP_STATUS_CONFIRMED
        elif status in ORDER_SIGNUP_ACCEPTED:
            self.status = SIGNUP_STATUS_ACTIVE
        elif status == ORDER_STATUS_CANCELLED:
            self.status = SIGNUP_STATUS_CANCELLED


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
