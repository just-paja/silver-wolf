from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.ShortPromotionText)
class CountryTranslationOptions(TranslationOptions):
    fields = ('text', 'quote_owner')
