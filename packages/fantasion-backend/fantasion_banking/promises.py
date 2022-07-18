import datetime

from dateutil.relativedelta import relativedelta
from django.apps import apps
from django.conf import settings
from django.db.models import CharField, PositiveIntegerField, Sum
from django.utils.translation import ugettext_lazy as _
from djmoney.money import Money
from django.template.loader import render_to_string
from fantasion_generics.emails import send_mail

from fantasion_generics.money import MoneyField
from fantasion_generics.titles import FacultativeTitleField

from .statements import StatementSpecification
from .time_limited import TimeLimitedManager, TimeLimitedModel

from .constants import (
    DEBT_SOURCE_GENERATED_INITIAL,
    DEBT_SOURCE_GENERATED_RECURRING,
    DEBT_TYPE_DEPOSIT,
    PROMISE_STATUS_DEPOSIT_PAID,
    PROMISE_STATUS_EXPECTED,
    PROMISE_STATUS_CHOICES,
    PROMISE_STATUS_OVERPAID,
    PROMISE_STATUS_PAID,
    PROMISE_STATUS_UNDERPAID,
    RECURRENCE_CHOICES,
    RECURRENCE_MONTHLY,
    RECURRENCE_YEARLY,
)


class UnownedPromise(Exception):
    pass


class PromiseManager(TimeLimitedManager):

    def filter_by_transaction(self, variable_symbol, specific_symbol):
        query = self.filter(variable_symbol=variable_symbol)
        # Ignore empty specific symbol and treat 0 as empty
        if specific_symbol and specific_symbol != '0':
            query = query.filter(specific_symbol=specific_symbol)
        return query


class Promise(StatementSpecification, TimeLimitedModel):

    class Meta:
        verbose_name = _('Promise')
        verbose_name_plural = _('Promises')
        unique_together = (('variable_symbol', ), )

    objects = PromiseManager()
    initial_amount = MoneyField(verbose_name=_('Initial amount'), )
    status = PositiveIntegerField(
        default=PROMISE_STATUS_EXPECTED,
        choices=PROMISE_STATUS_CHOICES,
        verbose_name=_('Status'),
    )
    title = FacultativeTitleField()
    repeat = CharField(
        blank=True,
        choices=RECURRENCE_CHOICES,
        max_length=31,
        null=True,
        verbose_name=_('Repeat'),
    )

    def __str__(self):
        model_name = _("Promise")
        title = str(f": {self.title}") if self.title else '#%s' % self.id
        return f"{model_name}{title}"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.initial_amount = self.amount
            super().save(*args, **kwargs)
        self.create_debts()
        self.amount = self.calculate_amount()
        self.status = self.calculate_status()
        if self.status == PROMISE_STATUS_OVERPAID:
            self.notify_overpaid()
        elif self.status == PROMISE_STATUS_UNDERPAID:
            self.notify_underpaid()
        elif self.status == PROMISE_STATUS_DEPOSIT_PAID:
            self.notify_deposit_paid()
        elif self.status == PROMISE_STATUS_PAID:
            self.notify_full_paid()
        super().save(*args, **kwargs)

    def get_volume_price_tag(self):
        return self.sum_statements()

    def calculate_status(self):
        received = self.sum_statements()
        deposit = self.sum_deposit()
        zero = Money(0, settings.BASE_CURRENCY)
        if received == zero:
            return PROMISE_STATUS_EXPECTED
        if received > self.amount:
            return PROMISE_STATUS_OVERPAID
        if received < self.amount:
            if deposit > zero and received >= deposit:
                return PROMISE_STATUS_DEPOSIT_PAID
            return PROMISE_STATUS_UNDERPAID
        return PROMISE_STATUS_PAID

    def get_owner_email(self):
        order = self.order_set.first()
        if order:
            return order.owner.email
        raise UnownedPromise(_(f"Promise {self.id} does not have any owner"))

    def notify_overpaid(self):
        subject = (_("Order {number}")).format(number=self.variable_symbol)
        received = self.sum_statements()
        amount = self.amount
        overpayment = received - amount
        body = render_to_string(
            'mail/overpaid.html',
            context={
                'overpayment': overpayment,
            },
        )
        send_mail([self.get_owner_email()], subject, body)

    def notify_underpaid(self):
        subject = (_("Order {number}")).format(number=self.variable_symbol)
        received = self.sum_statements()
        amount = self.amount
        debt = amount - received
        body = render_to_string(
            'mail/underpaid.html',
            context={
                'debt': debt,
            },
        )
        send_mail([self.get_owner_email()], subject, body)

    def notify_deposit_paid(self):
        subject = (_("Order {number}")).format(number=self.variable_symbol)
        received = self.sum_statements()
        amount = self.amount
        debt = amount - received
        deposit = self.sum_deposit()
        body = render_to_string(
            'mail/deposit_paid.html',
            context={
                'debt': debt,
                'deposit': deposit,
            },
        )
        send_mail([self.get_owner_email()], subject, body)

    def notify_full_paid(self):
        subject = (_("Order {number}")).format(number=self.variable_symbol)
        amount = self.amount
        body = render_to_string(
            'mail/full_paid.html',
            context={
                'amount': amount,
            },
        )
        send_mail([self.get_owner_email()], subject, body)

    def create_debts(self):
        self.create_initial_debt()
        self.create_recurrent_debts()

    def create_recurrent_debts(self):
        delta = self.get_recurrence_delta()
        if delta:
            today = datetime.date.today()
            date = self.start + delta
            end = today if not self.end or self.end > today else self.end
            while date <= end:
                self.ensure_recurrent_debt(date)
                date += delta

    def ensure_recurrent_debt(self, date):
        delta = self.get_recurrence_delta()
        if delta:
            debt = self.debts.filter(
                maturity=date,
                source=DEBT_SOURCE_GENERATED_RECURRING,
            ).first()
            if debt:
                return debt
            Debt = apps.get_model("fantasion_banking", "Debt")
            debt = Debt(
                amount=self.initial_amount,
                maturity=date,
                promise=self,
                source=DEBT_SOURCE_GENERATED_RECURRING,
            )
            debt.save()
            return debt
        return None

    def create_initial_debt(self):
        Debt = apps.get_model("fantasion_banking", "Debt")
        if self.debts.count() == 0 and self.amount.amount > 0:
            debt = Debt(
                amount=self.amount,
                maturity=self.start,
                promise=self,
                source=DEBT_SOURCE_GENERATED_INITIAL,
            )
            debt.save()

    def calculate_amount(self):
        result = self.debts.aggregate(amount=Sum('amount'))
        return result.get('amount', 0) or 0

    def get_recurrence_delta(self):
        if self.repeat == RECURRENCE_MONTHLY:
            return relativedelta(months=1)
        if self.repeat == RECURRENCE_YEARLY:
            return relativedelta(years=1)
        return None

    def sum_statements(self):
        result = self.statements.aggregate(ballance=Sum('amount'))
        ballance = result['ballance']
        return Money(ballance if ballance else 0, settings.BASE_CURRENCY)

    def sum_deposit(self):
        result = self.debts.filter(
            debt_type=DEBT_TYPE_DEPOSIT, ).aggregate(ballance=Sum('amount'))
        ballance = result['ballance']
        return Money(ballance if ballance else 0, settings.BASE_CURRENCY)

    def get_amount_diff(self):
        return self.sum_statements() - self.calculate_amount()

    get_volume_price_tag.short_description = _('Received')
