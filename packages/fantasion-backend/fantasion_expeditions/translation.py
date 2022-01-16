from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.AgeGroup)
class AgeGroupTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(models.StaffRoleMedia)
class StaffRoleMediaTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.StaffRole)
class StaffRoleTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.LeisureCentre)
class LeisureCentreTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.LeisureCentreMedia)
class LeisureCentreMediaTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.Expedition)
class ExpeditionTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.ExpeditionMedia)
class ExpeditionMediaOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.ExpeditionProgram)
class ExpeditionProgramTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(models.ExpeditionProgramMedia)
class ExpeditionProgramMediaOptions(TranslationOptions):
    fields = ('title', 'description',)
