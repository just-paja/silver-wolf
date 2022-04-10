from django.core.exceptions import ValidationError
from django.dispatch import Signal
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from encrypted_model_fields.fields import EncryptedCharField
from django.db.models import (
    CASCADE,
    ForeignKey,
    PositiveIntegerField,
    Sum,
)

from fantasion_generics.money import MoneyField
from fantasion_generics.models import PublicModel

from .fields import AccountNumberField, BankNumberField, BicField, IBanField
from .constants import (
    ACCOUNT_DRIVER_FIO,
    ACCOUNT_DRIVER_CHOICES,
    SCRAPE_SOURCE_CHOICES,
    SCRAPE_SOURCE_MANUAL,
    SCRAPE_STATUS_FAILURE,
    SCRAPE_STATUS_CHOICES,
    SCRAPE_STATUS_REQUEST,
    SCRAPE_STATUS_SUCCESS,
)

statement_registered = Signal(providing_args=['instance'])


class Account(PublicModel):

    class Meta:
        verbose_name = _('Account')
        verbose_name_plural = _('Accounts')

    account_number = AccountNumberField(blank=True, null=True)
    bank = BankNumberField(blank=True, null=True)
    iban = IBanField(blank=True, null=True)
    bic = BicField(blank=True, null=True)
    ballance = MoneyField(verbose_name=_("Ballance"), default=0)
    driver = PositiveIntegerField(
        blank=True,
        choices=ACCOUNT_DRIVER_CHOICES,
        null=True,
        verbose_name=_("Driver"),
    )
    fio_readonly_key = EncryptedCharField(
        max_length=255,
        blank=True,
        null=True,
    )

    def calculate_ballance(self):
        result = self.statements.aggregate(ballance=Sum('amount'))
        ballance = result['ballance']
        return ballance if ballance else 0

    def resolve_driver(self):
        if self.driver == ACCOUNT_DRIVER_FIO:
            from . import driver_fio
            return driver_fio
        return None

    def get_last_scrape_statement(self):
        return self.statements.filter(
            ident__isnull=False, ).order_by('-created').first()

    def clean(self):
        if self.driver == ACCOUNT_DRIVER_FIO and not self.fio_readonly_key:
            raise ValidationError({
                'fio_readonly_key': _('The Fio Bank token must be provided'),
            })

    def sync(self, days_back=1, source=SCRAPE_SOURCE_MANUAL):
        driver = self.resolve_driver()
        if driver:
            scrape = BankScrape(
                account=self,
                days_back=days_back,
                source=source,
            )
            scrape.save()
            try:
                driver.sync(self, scrape)
                scrape.status = SCRAPE_STATUS_SUCCESS
                scrape.save()
            except Exception as exc:
                scrape.status = SCRAPE_STATUS_FAILURE
                scrape.save()
                raise exc


class BankScrape(TimeStampedModel):

    class Meta:
        verbose_name = _('Bank Scrape')
        verbose_name_plural = _('Bank scrapes')

    account = ForeignKey(
        'Account',
        on_delete=CASCADE,
        related_name='scrapes',
        verbose_name=_('Account'),
    )
    days_back = PositiveIntegerField(
        null=True,
        blank=True,
    )
    source = PositiveIntegerField(
        default=SCRAPE_SOURCE_MANUAL,
        choices=SCRAPE_SOURCE_CHOICES,
    )
    status = PositiveIntegerField(
        default=SCRAPE_STATUS_REQUEST,
        choices=SCRAPE_STATUS_CHOICES,
    )
