from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

from . import models


class ProfileMediaAdmin(NestedStackedInline):
    model = models.ProfileMedia
    extra = 0


class ProfileAdmin(BaseAdmin):
    model = models.Profile
    list_display = ('title', 'public', 'modified')
    inlines = (ProfileMediaAdmin,)


class SportAdmin(BaseAdmin):
    model = models.Sport
    list_display = ('title', )
