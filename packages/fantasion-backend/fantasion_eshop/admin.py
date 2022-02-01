from fantasion_generics.admin import BaseAdmin, TranslatedAdmin

from . import models


class CurrencyAdmin(TranslatedAdmin):
    model = models.Currency
    list_display = (
        'code',
        'title',
        'exchange_rate',
        'enabled',
    )


class OrderAdmin(BaseAdmin):
    model = models.Order


class PriceLevelAdmin(TranslatedAdmin):
    model = models.PriceLevel
    list_display = (
        'title',
        'enabled',
    )


class PromotionCodeAdmin(BaseAdmin):
    model = models.PromotionCode
    list_display = (
        'code',
        'max_usages',
        'enabled',
        'valid_from',
        'valid_until',
    )
    list_filter = ('enabled', )
