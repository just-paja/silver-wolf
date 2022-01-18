from fantasion_generics.admin import BaseAdmin, MediaAdmin
from modeltranslation.admin import TranslationAdmin

from . import models


class ShortPromotionTextAdmin(BaseAdmin, TranslationAdmin):
    model = models.ShortPromotionText
    list_display = ('text', 'quote_owner', 'modified')
    list_filter = ('quote_owner', )


class StaticArticleMediaAdmin(MediaAdmin):
    model = models.StaticArticleMedia


class StaticArticleAdmin(BaseAdmin, TranslationAdmin):
    model = models.StaticArticle
    list_display = ('key', 'title', 'modified')
    list_filter = ('public', )
    fields = ('key', 'title', 'description', 'text', 'public')
    inlines = (StaticArticleMediaAdmin,)
