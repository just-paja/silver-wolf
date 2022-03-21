from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.FlavourText)
class FlavourTextOptions(TranslationOptions):
    fields = ('text', 'quote_owner')


@register(models.FrequentlyAskedQuestion)
class FrequentlyAskedQuestionOptions(TranslationOptions):
    fields = ('question', 'short_answer', 'detailed_answer')


@register(models.FrequentlyAskedQuestionMedia)
class FrequentlyAskedQuestionMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.Monster)
class MonsterOptions(TranslationOptions):
    fields = ('species', 'title', 'description', 'text')


@register(models.MonsterMedia)
class MonsterMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.StaticArticle)
class StaticArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'text')


@register(models.StaticArticleMedia)
class StaticArticleMediaTranslationOptions(TranslationOptions):
    fields = ('description', )
