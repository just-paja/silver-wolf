from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.SignupDocumentType)
class SignupDocumentTypeTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
