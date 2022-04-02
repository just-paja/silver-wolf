from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.PriceLevel)
class PriceLevelTranslationOptions(TranslationOptions):
    fields = ('title',)
