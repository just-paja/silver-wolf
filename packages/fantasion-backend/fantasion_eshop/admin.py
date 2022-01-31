from fantasion_generics.admin import BaseAdmin
from modeltranslation.admin import TranslationAdmin

from . import models


class CurrencyAdmin(BaseAdmin, TranslationAdmin):
    model = models.Currency
    list_display = (
        'code',
        'title',
        'exchange_rate',
        'enabled',
    )


class OrderAdmin(BaseAdmin):
    model = models.Order


class PriceLevelAdmin(BaseAdmin, TranslationAdmin):
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
