from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _

from fantasion_generics.money import MoneyField
from fantasion_generics.titles import FacultativeDescriptionField

from django.db.models import (
    CASCADE,
    DateField,
    ForeignKey,
    PositiveIntegerField,
)

from .constants import (
    DEBT_SOURCE_CHOICES,
    DEBT_SOURCE_MANUAL,
    DEBT_TYPE_CHOICES,
)


class Debt(TimeStampedModel):

    class Meta:
        verbose_name = _('Debt')
        verbose_name_plural = _('Debts')

    promise = ForeignKey('Promise', on_delete=CASCADE, related_name='debts')
    amount = MoneyField(verbose_name=_("Amount"))
    source = PositiveIntegerField(
        default=DEBT_SOURCE_MANUAL,
        choices=DEBT_SOURCE_CHOICES,
    )
    debt_type = PositiveIntegerField(
        blank=True,
        default=None,
        choices=DEBT_TYPE_CHOICES,
        null=True,
    )
    description = FacultativeDescriptionField(blank=True, null=True)
    maturity = DateField(verbose_name=_('Maturity'), )

    def __str__(self):
        return '#%s: %s' % (self.pk, self.amount)

    def save(self, *args, **kwargs):
        super().save()
        if self.source == DEBT_SOURCE_MANUAL:
            self.promise.save(*args, **kwargs)
