from fantasion_generics.admin import BaseAdmin
from modeltranslation.admin import TranslationAdmin

from . import models


class ShortPromotionTextAdmin(BaseAdmin, TranslationAdmin):
    model = models.ShortPromotionText
    list_display = ('text', 'quote_owner', 'modified')
    list_filter = ('quote_owner', )
