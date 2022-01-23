from fantasion_generics.admin import BaseAdmin, MediaAdmin
from modeltranslation.admin import TranslationAdmin

from . import models


class FlavourTextAdmin(BaseAdmin, TranslationAdmin):
    model = models.FlavourText
    list_display = ('text', 'quote_owner', 'modified', 'importance')
    list_filter = ('quote_owner', )


class FrequentlyAskedQuestionMediaAdmin(MediaAdmin):
    model = models.FrequentlyAskedQuestionMedia


class FrequentlyAskedQuestion(BaseAdmin, TranslationAdmin):
    model = models.FrequentlyAskedQuestion
    list_display = ('id', 'question')
    list_filter = ('public', )
    inlines = (FrequentlyAskedQuestionMediaAdmin, )


class StaticArticleMediaAdmin(MediaAdmin):
    model = models.StaticArticleMedia


class StaticArticleAdmin(BaseAdmin, TranslationAdmin):
    model = models.StaticArticle
    list_display = ('key', 'title', 'modified')
    list_filter = ('public', )
    fields = ('key', 'title', 'description', 'text', 'public')
    inlines = (StaticArticleMediaAdmin, )
