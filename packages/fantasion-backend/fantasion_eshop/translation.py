from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.Currency)
class CurrencyTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(models.PriceLevel)
class PriceLevelTranslationOptions(TranslationOptions):
    fields = ('title',)
