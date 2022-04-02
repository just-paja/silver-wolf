from fantasion_generics.admin import BaseAdmin, TranslatedAdmin
from fantasion_signups.models import Signup
from nested_admin import NestedStackedInline

from . import models


class SignupAdmin(NestedStackedInline):
    model = Signup
    extra = 0
    fields = (
        'family',
        'participant',
        'troop',
        'product_price',
        'price',
        'status',
        'legal_guardian',
        'cancelled_for',
    )
    autocomplete_fields = (
        'troop',
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
    autocomplete_fields = (
        'owner',
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
    list_display = (
        'product',
        'price_level',
        'price',
        'available_since',
        'available_until',
    )
