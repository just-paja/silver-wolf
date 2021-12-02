from modeltranslation.translator import register, TranslationOptions
from .models import MediaObject

@register(MediaObject)
class MediaObjectTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)
