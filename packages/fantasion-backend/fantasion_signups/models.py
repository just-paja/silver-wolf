from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    ForeignKey,
    RESTRICT,
)

from fantasion_eshop.models import OrderItem


class Participant(TimeStampedModel):
    name = CharField(
        max_length=255
    )
    birthdate = DateField()


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

    def get_description(self):
        return 'Signup: {participant}'.format(
            participant=self.participant
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
        super().save(*args, **kwargs)
