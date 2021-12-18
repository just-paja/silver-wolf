from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.Country)
class CountryTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(models.Location)
class LocationTranslationOptions(TranslationOptions):
    fields = ('name',)
