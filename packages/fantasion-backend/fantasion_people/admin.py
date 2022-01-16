from fantasion_generics.admin import BaseAdmin, MediaAdmin
from nested_admin import NestedStackedInline
from modeltranslation.admin import TranslationAdmin

from . import models


class ProfileMediaAdmin(MediaAdmin):
    model = models.ProfileMedia


class ProfileAdmin(BaseAdmin, TranslationAdmin):
    model = models.Profile
    list_display = ('title', 'public', 'modified')
    inlines = (ProfileMediaAdmin,)


class AllergyAdmin(BaseAdmin, TranslationAdmin):
    model = models.Allergy
    list_display = ('title', )


class HobbyAdmin(BaseAdmin, TranslationAdmin):
    model = models.Hobby
    list_display = ('title', )


class FamilyMemberAdmin(NestedStackedInline):
    model = models.FamilyMember
    extra = 0


class FamilyAdmin(BaseAdmin):
    model = models.Family
    list_display = ('title', )
    inlines = (FamilyMemberAdmin,)
