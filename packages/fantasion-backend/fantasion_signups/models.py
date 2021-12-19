from datetime import datetime

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
from fantasion_generics.media import MediaModelMixin
from fantasion_generics.photos import PrivatePhotoModel
from fantasion_eshop.models import OrderItem


class Participant(TimeStampedModel):
    name = CharField(
        max_length=255
    )
    birthdate = DateField()


SIGNUP_STATUS_NEW = 1
SIGNUP_STATUS_CONFIRMED = 2
SIGNUP_STATUS_DOWN_PAYMENT_PAID = 3
SIGNUP_STATUS_PAID = 4
SIGNUP_STATUS_CANCELLED = 5

SIGNUP_STATES = (
    (SIGNUP_STATUS_NEW, _('New')),
    (SIGNUP_STATUS_CONFIRMED, _('Confirmed')),
    (SIGNUP_STATUS_DOWN_PAYMENT_PAID, _('Down payment paid')),
    (SIGNUP_STATUS_PAID, _('Paid')),
    (SIGNUP_STATUS_CANCELLED, _('Cancelled')),
)


class Signup(OrderItem):
    family = ForeignKey(
        'fantasion_people.Family',
        on_delete=RESTRICT,
        related_name='signups',
    )
    batch_age_group = ForeignKey(
        'fantasion_expeditions.BatchAgeGroup',
        on_delete=RESTRICT,
        related_name='signups',
    )
    participant = ForeignKey(
        Participant,
        on_delete=RESTRICT,
        related_name='signups',
    )
    legal_guardian = BooleanField()
    status = PositiveIntegerField(
        choices=SIGNUP_STATES,
    )
    submitted_at = DateTimeField(
        null=True,
        blank=True,
        help_text=_(
            'The exact date and time signup was submitted.'
            'Date is generated automatically'
        ),
    )
    cancelled_for = TextField(
        blank=True,
        null=True,
        help_text=_(
            'Write down a short explanation why was this signup cancelled'
        )
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial_status = self.status

    def get_description(self):
        return 'Signup: {participant}'.format(
            participant=self.participant
        )

    def was_submitted(self):
        return (
            self.status == SIGNUP_STATUS_CONFIRMED and
            self.status != self.initial_status
        )

    def clean(self):
        """
        Owner must have permission to create signups on behalf of a family
        """
        if self.family.can_user_own_order(self.order.owner):
            raise ValidationError(
                _((
                    'User {user_name} is not allowed to make signups on',
                    'behalf of Family#{family_id}.'
                )).format(
                    user_name=self.order.owner.get_full_name(),
                    family_id=self.family.id,
                )
            )

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
    required = BooleanField(
        default=False,
        help_text=_(
            'Signup will be marked as incomplete until parent uploads'
            'this document'
        )
    )


class SignupDocument(TimeStampedModel):
    signup = ForeignKey(
        Signup,
        on_delete=CASCADE,
        related_name='documents',
    )
    document_type = ForeignKey(
        SignupDocumentType,
        on_delete=RESTRICT,
        related_name='documents',
    )


class SignupDocumentMedia(MediaModelMixin, PrivatePhotoModel):
    parent = ForeignKey(
        SignupDocument,
        on_delete=CASCADE,
        related_name='media',
    )

    @property
    def upload_dir(self):
        return 'signups/{0}'.format(self.parent_id)


class SignupDocumentVerification(TimeStampedModel):
    document = ForeignKey(
        SignupDocument,
        on_delete=CASCADE,
        related_name='verifications',
    )
    verified_by = ForeignKey(
        'auth.User',
        on_delete=RESTRICT,
        related_name='signup_document_verifications',
    )
    verified_on = DateField()
    valid_until = DateField()
