from django.utils.translation import gettext_lazy as _
from django.db.models import CharField


class AccountNumberField(CharField):

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        kwargs['verbose_name'] = kwargs.get(
            'verbose_name',
            _('Account number'),
        )
        kwargs['help_text'] = kwargs.get(
            'help_text',
            _('Account number of person sending this payment'),
        )
        super().__init__(*args, **kwargs)


class BankNumberField(CharField):

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 63
        kwargs['verbose_name'] = kwargs.get('verbose_name', _('Bank'))
        kwargs['help_text'] = kwargs.get('help_text',
                                         _('Bank sending this payment'))
        super().__init__(*args, **kwargs)


class IBanField(CharField):

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        kwargs['verbose_name'] = kwargs.get('verbose_name', _('IBAN'))
        kwargs['help_text'] = kwargs.get(
            'help_text', _('International bank account number'))
        super().__init__(*args, **kwargs)


class BicField(CharField):

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        kwargs['verbose_name'] = kwargs.get('verbose_name', _('BIC'))
        kwargs['help_text'] = kwargs.get(
            'help_text', _('Business identification code, specified by SWIFT'))
        super().__init__(*args, **kwargs)
