from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.AgeGroup)
class AgeGroupTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(models.LeisureCentre)
class LeisureCentreTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.LeisureCentreMedia)
class LeisureCentreMediaTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.Expedition)
class ExpeditionTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)
