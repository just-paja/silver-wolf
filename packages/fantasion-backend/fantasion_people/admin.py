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


class AllergyAdmin(BaseAdmin):
    model = models.Allergy
    list_display = ('title', )


class SportAdmin(BaseAdmin):
    model = models.Sport
    list_display = ('title', )


class FamilyMemberAdmin(NestedStackedInline):
    model = models.FamilyMember
    extra = 0


class FamilyAdmin(BaseAdmin):
    model = models.Family
    list_display = ('title', )
    inlines = (FamilyMemberAdmin,)
