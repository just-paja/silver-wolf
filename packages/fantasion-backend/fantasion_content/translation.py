from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.ShortPromotionText)
class ShortPromotionTextOptions(TranslationOptions):
    fields = ('text', 'quote_owner')


@register(models.StaticArticle)
class StaticArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
