from fantasion_generics.admin import BaseAdmin

from . import models


class CurrencyAdmin(BaseAdmin):
    model = models.Currency
    list_display = (
        'code',
        'title',
        'exchange_rate',
        'enabled',
    )


class OrderAdmin(BaseAdmin):
    model = models.Order


class PriceLevelAdmin(BaseAdmin):
    model = models.PriceLevel
    list_display = (
        'title',
        'enabled',
    )
