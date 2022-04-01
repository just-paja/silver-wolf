from fantasion_generics.admin import BaseAdmin, TranslatedAdmin
from fantasion_signups.models import Signup
from nested_admin import NestedStackedInline

from . import models


class CurrencyAdmin(TranslatedAdmin):
    model = models.Currency
    list_display = (
        'code',
        'title',
        'exchange_rate',
        'enabled',
    )


class SignupAdmin(NestedStackedInline):
    model = Signup
    extra = 0
    fields = (
        'family',
        'participant',
        'batch_age_group',
        'product_price',
        'price',
        'currency',
        'status',
        'legal_guardian',
        'cancelled_for',
    )
    autocomplete_fields = (
        'batch_age_group',
        'family',
        'participant',
        'product_price',
    )


class OrderAdmin(BaseAdmin):
    model = models.Order
    inlines = (SignupAdmin,)
    list_display = (
        'id',
        'calculate_price',
        'owner',
        'created',
    )


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


class ProductPriceAdmin(BaseAdmin):
    model = models.ProductPrice
    extra = 0
    search_fields = ('product__title', 'price_level__title')
