from fantasion_generics.admin import BaseAdmin, TranslatedAdmin
from fantasion_signups.models import Signup
from nested_admin import NestedStackedInline

from . import models


class OrderSignupAdmin(NestedStackedInline):
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


class OrderPromotionCodeAdmin(NestedStackedInline):
    model = models.OrderPromotionCode
    extra = 0
    autocomplete_fields = ('promotion_code',)
    readonly_fields = ('price',)
    fields = ('promotion_code', 'price',)


class OrderAdmin(BaseAdmin):
    model = models.Order
    inlines = (OrderSignupAdmin, OrderPromotionCodeAdmin)
    list_display = (
        'id',
        'price',
        'owner',
        'created',
    )
    autocomplete_fields = (
        'owner',
    )
    readonly_fields = (
        'deposit',
        'get_surcharge',
        'price',
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
    search_fields = ('code', )


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
