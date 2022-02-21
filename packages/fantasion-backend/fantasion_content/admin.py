from fantasion_generics.admin import MediaAdmin, TranslatedAdmin

from . import models


class FlavourTextAdmin(TranslatedAdmin):
    model = models.FlavourText
    list_display = ('text', 'quote_owner', 'modified', 'importance')
    list_filter = ('quote_owner', )


class FrequentlyAskedQuestionMediaAdmin(MediaAdmin):
    model = models.FrequentlyAskedQuestionMedia


class FrequentlyAskedQuestion(TranslatedAdmin):
    model = models.FrequentlyAskedQuestion
    list_display = (
        'id',
        'question',
        'modified',
        'public',
    )
    list_filter = ('public', )
    inlines = (FrequentlyAskedQuestionMediaAdmin, )


class MonsterMediaAdmin(MediaAdmin):
    model = models.MonsterMedia


class Monster(TranslatedAdmin):
    model = models.Monster
    list_display = (
        'id',
        'species',
        'description',
        'text',
        'importance',
        'public',
    )
    list_filter = ('public', )
    inlines = (MonsterMediaAdmin, )


class StaticArticleMediaAdmin(MediaAdmin):
    model = models.StaticArticleMedia


class StaticArticleAdmin(TranslatedAdmin):
    model = models.StaticArticle
    list_display = ('key', 'title', 'modified')
    list_filter = ('public', )
    fields = ('key', 'title', 'description', 'text', 'public')
    inlines = (StaticArticleMediaAdmin, )
