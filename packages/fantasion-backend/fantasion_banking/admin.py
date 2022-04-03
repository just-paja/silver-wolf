import datetime

from django.contrib import messages
from django.contrib.admin.filters import SimpleListFilter
from django.db.models import Count, Q
from django.utils.safestring import mark_safe
from django.shortcuts import redirect, get_object_or_404
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from nested_admin import NestedStackedInline

from fantasion_generics.admin import BaseAdmin, TranslatedAdmin

from . import models

import urllib.parse as urlparse
from urllib.parse import urlencode

ACTIVE_YES = 1
ACTIVE_NO = 2

ACTIVE_CHOICES = (
    (ACTIVE_YES, _('Yes')),
    (ACTIVE_NO, _('No')),
)


def empty_value(value):
    return mark_safe('<span class="empty-value">%s</span>' % value)


class IntValueFilter(SimpleListFilter):

    class Meta:
        abstract = True

    def lookups(self, request, model_admin):
        raise NotImplementedError(
            'The SimpleListFilter.lookups() method must be overridden to '
            'return a list of tuples (value, verbose value).')

    def value(self):
        try:
            return super().value()
        except (TypeError, ValueError):
            return None


class TimeLimitedActiveFilter(IntValueFilter):
    title = _('Active')
    parameter_name = 'active'

    def lookups(self, request, model_admin):
        return ACTIVE_CHOICES

    def queryset(self, request, queryset):
        today = datetime.date.today()
        filter_value = self.value()
        if filter_value == ACTIVE_YES:
            return queryset.filter(Q(end__isnull=True)
                                   | Q(end__gt=today)).filter(
                                       Q(start__isnull=True)
                                       | Q(start__lte=today))
        if filter_value == ACTIVE_NO:
            return queryset.filter(
                Q(start__lt=today, end__isnull=False, end__lt=today)
                | Q(start__gt=today),
                start__isnull=False,
            )
        return queryset


class TimeLimitedAdmin():

    def format_start(self, item):
        return item.start or empty_value('-∞')

    def format_end(self, item):
        if hasattr(item, 'repeat') and not item.repeat:
            return empty_value('∅')
        return item.end or empty_value('∞')

    def changelist_view(self, request, extra_context=None):
        has_questionmark = '?' in request.META.get('HTTP_REFERER', '')
        has_param = 'active' in request.GET
        if has_questionmark or has_param:
            return super().changelist_view(request, extra_context)
        url_parts = list(urlparse.urlparse(request.get_full_path()))
        query = dict(urlparse.parse_qsl(url_parts[4]))
        query.update({'active': 1})
        url_parts[4] = urlencode(query)
        return redirect(urlparse.urlunparse(url_parts))

    format_end.admin_order_field = 'end'
    format_end.short_description = _('Repeat until')
    format_start.admin_order_field = 'start'
    format_start.short_description = _('Payable since')


class AccountAdmin(TranslatedAdmin):
    model = models.Account
    fields = (
        'title',
        'description',
        'account_number',
        'bank',
        'iban',
        'bic',
        'driver',
        'fio_readonly_key',
    )
    list_display = (
        'title',
        'driver',
        'ballance',
        'iban',
        'modified',
    )
    search_fields = (
        'title',
        'description',
        'account_number',
        'bank',
        'iban',
        'bic',
    )
    list_filter = ('driver', )
    change_form_template = 'admin/account_change_form.html'
    change_list_template = 'admin/account_change_list.html'

    def get_urls(self):
        return super().get_urls() + [
            path(
                'bank-sync',
                self.admin_site.admin_view(self.bank_sync),
                name='account_bank_sync_all',
            ),
            path(
                '<account_id>/bank-sync',
                self.admin_site.admin_view(self.bank_sync_account),
                name='account_bank_sync',
            ),
        ]

    def bank_sync(self, request):
        accounts = models.Account.objects.filter(driver__isnull=False).all()
        for account in accounts:
            account.sync()
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Pairing was finished'),
        )
        return redirect(reverse('admin:fantasion_banking_account_changelist'))

    def bank_sync_account(self, request, account_id):
        account = get_object_or_404(
            models.Account,
            pk=account_id,
            driver__isnull=False,
        )
        account.sync()
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Pairing was finished'),
        )
        return redirect(
            reverse('admin:fantasion_banking_statement_changelist'))


def pair_known_account_to_statements(account):
    statements = models.Statement.objects.filter(counterparty__isnull=True)
    for statement in statements:
        if account.matches_statement(statement):
            statement.counterparty = account.owner
            statement.save()


class KnownAccountInlineAdmin(NestedStackedInline):
    model = models.KnownAccount
    extra = 0


class CounterPartyAdmin(TranslatedAdmin):
    model = models.CounterParty
    inlines = [KnownAccountInlineAdmin]
    list_display = (
        'title',
        'count_accounts',
        'count_statements',
        'created',
        'modified',
    )
    change_form_template = 'admin/counterparty_change_form.html'
    change_list_template = 'admin/counterparty_change_list.html'
    search_fields = (
        'title',
        'accounts__sender_account_number',
        'accounts__sender_bank',
        'accounts__sender_iban',
        'accounts__sender_bic',
    )
    ordering = ('-modified', )

    def get_urls(self):
        return super().get_urls() + [
            path(
                'pair',
                self.admin_site.admin_view(self.pair_all),
                name='counterparty_pair_all',
            ),
            path(
                '<counterparty_id>/pair',
                self.admin_site.admin_view(self.pair_counterparty),
                name='counterparty_pair',
            ),
        ]

    def pair_counterparty_to_statements(self, counterparty):
        for account in counterparty.accounts.all():
            pair_known_account_to_statements(account)

    def pair_counterparty(self, request, counterparty_id):
        counterparty = get_object_or_404(
            models.CounterParty,
            pk=counterparty_id,
        )
        self.pair_counterparty_to_statements(counterparty)
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Pairing was finished'),
        )
        return redirect(
            reverse(
                'admin:fantasion_banking_counterparty_change',
                args=[counterparty.pk],
            ))

    def pair_all(self, request):
        for counterparty in models.CounterParty.objects.all():
            self.pair_counterparty_to_statements(counterparty)
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Pairing was finished'),
        )
        return redirect(
            reverse('admin:fantasion_banking_counterparty_changelist'))

    def get_queryset(self, request):
        querystring = super().get_queryset(request)
        querystring = querystring.annotate(Count('statements', distinct=True))
        querystring = querystring.annotate(Count('accounts', distinct=True))
        return querystring

    def count_accounts(self, obj):
        return obj.accounts__count

    def count_statements(self, obj):
        return obj.statements__count

    count_accounts.short_description = _('Known accounts')
    count_accounts.admin_order_field = 'accounts__count'
    count_statements.short_description = _('Statements')
    count_statements.admin_order_field = 'statements__count'


class KnownAccountAdmin(BaseAdmin):
    model = models.KnownAccount
    fields = (
        'owner',
        'sender_account_number',
        'sender_bank',
        'sender_iban',
        'sender_bic',
    )
    list_display = (
        'sender_account_number',
        'sender_bank',
        'sender_iban',
        'sender_bic',
        'owner',
        'created',
        'modified',
    )
    change_form_template = 'admin/known_account_change_form.html'
    search_fields = (
        'sender_account_number',
        'sender_bank',
        'sender_iban',
        'sender_bic',
    )

    def get_urls(self):
        return super().get_urls() + [
            path(
                '<known_account_id>/pair',
                self.admin_site.admin_view(self.pair_known_account),
                name='known_account_pair',
            ),
        ]

    def pair_known_account(self, request, known_account_id):
        pair_known_account_to_statements(
            get_object_or_404(
                models.KnownAccount,
                pk=known_account_id,
            ))
        return redirect(
            reverse(
                'admin:fantasion_banking_knownaccount_change',
                args=[known_account_id],
            ))


DIRECTION_INBOUND = 1
DIRECTION_OUBOUND = 2

PAIR_YES = 1
PAIR_NO = 2


class PaymentDirectionFilter(IntValueFilter):
    title = _('Payment direction')
    parameter_name = 'direction'

    def lookups(self, request, model_admin):
        return (
            (DIRECTION_INBOUND, _('Inbound')),
            (DIRECTION_OUBOUND, _('Outbound')),
        )

    def queryset(self, request, queryset):
        filter_value = self.value()
        if filter_value == DIRECTION_INBOUND:
            return queryset.filter(amount__gt=0)
        if filter_value == DIRECTION_OUBOUND:
            return queryset.filter(amount__lt=0)
        return queryset


class PaymentPairingStatusFilter(IntValueFilter):
    title = _('Has pair')
    parameter_name = 'has_pair'

    def lookups(self, request, model_admin):
        return (
            (PAIR_YES, _('Yes')),
            (PAIR_NO, _('No')),
        )

    def queryset(self, request, queryset):
        filter_value = self.value()
        if filter_value == 1:
            return queryset.filter(promise__isnull=False)
        if filter_value == 2:
            return queryset.filter(promise__isnull=True)
        return queryset


class DebtAdmin(NestedStackedInline):
    model = models.Debt
    fields = ('amount', 'maturity')
    extra = 0


class PromiseAdmin(BaseAdmin, TimeLimitedAdmin):

    class Media:
        pass

    model = models.Promise
    inlines = [DebtAdmin]
    fieldsets = (
        (None, {
            'fields': ('title', ),
        }),
        (None, {
            'fields': ('start', 'repeat', 'end'),
        }),
        (None, {
            'fields': (
                'variable_symbol',
                'specific_symbol',
                'constant_symbol',
            ),
        }),
        (None, {
            'fields': (
                'created',
                'modified',
            ),
        }),
    )
    change_form_template = 'admin/promise_change_form.html'
    change_list_template = 'admin/promise_change_list.html'
    list_filter = (
        TimeLimitedActiveFilter,
        'status',
        'repeat',
        PaymentDirectionFilter,
    )
    list_display = (
        '__str__',
        'status',
        'amount',
        'get_volume_price_tag',
        'variable_symbol',
        'is_active',
        'format_start',
        'format_end',
    )
    search_fields = (
        'variable_symbol',
        'specific_symbol',
        'constant_symbol',
        'title',
    )
    readonly_fields = ('created', 'modified')

    def get_urls(self):
        return super().get_urls() + [
            path('regenerate',
                 self.admin_site.admin_view(self.promises_regenerate),
                 name='promises_regenerate'),
        ]

    def promises_regenerate(self, request):
        promises = models.Promise.objects.filter(repeat__isnull=False).all()
        for promise in promises:
            promise.save()
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Promise regeneration was finished'),
        )
        return redirect(
            reverse('admin:fantasion_banking_promise_changelist'), )


class StatementAdmin(BaseAdmin):

    class Media:
        pass

    model = models.Statement
    change_form_template = 'admin/statement_change_form.html'
    fieldsets = (
        (None, {
            'fields': ('account', ),
        }),
        (None, {
            'fields': (
                'amount',
                'received_at',
                'promise',
            ),
        }),
        (None, {
            'fields': (
                'sender_account_number',
                'sender_bank',
                'sender_iban',
                'sender_bic',
            ),
        }),
        (None, {
            'fields': (
                'variable_symbol',
                'specific_symbol',
                'constant_symbol',
            ),
        }),
        (None, {
            'fields': (
                'ident',
                'user_identification',
                'message',
                'counterparty',
            ),
        }),
    )
    list_display = (
        'id',
        'link_counterparty',
        'amount',
        'promise',
        'received_at',
        'sender_account_number',
        'sender_bank',
        'variable_symbol',
        'specific_symbol',
        'constant_symbol',
    )
    list_filter = (
        PaymentDirectionFilter,
        PaymentPairingStatusFilter,
    )
    autocomplete_fields = ('promise', 'counterparty')
    search_fields = (
        'promise__name',
        'counterparty__name',
        'sender_account_number',
        'sender_bank',
        'sender_iban',
        'sender_bic',
        'variable_symbol',
        'specific_symbol',
        'constant_symbol',
    )

    def link_counterparty(self, statement):
        if statement.counterparty:
            owner = statement.counterparty
            name = owner.name
            link = reverse('admin:fantasion_banking_counterparty_change',
                           args=[owner.pk])
            return format_html('<a href="%s">%s</a>' % (link, name))
        return None

    link_counterparty.short_description = _('Counterparty')
    link_counterparty.admin_order_field = 'counterparty__name'
