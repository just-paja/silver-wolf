from fantasion_generics.admin import BaseAdmin

from . import models


class ShortPromotionTextAdmin(BaseAdmin):
    model = models.ShortPromotionText
    list_display = ('text', 'quote_owner', 'modified')
    list_filter = ('quote_owner', )
