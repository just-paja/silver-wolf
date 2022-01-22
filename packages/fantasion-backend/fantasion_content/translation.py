from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.FlavourText)
class FlavourTextOptions(TranslationOptions):
    fields = ('text', 'quote_owner')


@register(models.StaticArticle)
class StaticArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'text')


@register(models.StaticArticleMedia)
class StaticArticleMediaTranslationOptions(TranslationOptions):
    fields = ('description',)
