from modeltranslation.translator import register, TranslationOptions

from .models import MediaObjectModel, NamedModel, PublicModel


@register(NamedModel)
class NamedModelTranslationOptions(TranslationOptions):
    fields = (
        "title",
        "description",
    )


@register(PublicModel)
class PublicModelTranslationOptions(TranslationOptions):
    fields = ("title", "description")


@register(MediaObjectModel)
class MediaObjectModelTranslationOptions(TranslationOptions):
    fields = ("description", )
