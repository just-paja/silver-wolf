from fantasion_generics.admin import BaseAdmin, MediaAdmin, TranslatedAdmin
from nested_admin import NestedStackedInline

from . import models


class ProfileMediaAdmin(MediaAdmin):
    model = models.ProfileMedia


class ProfileAdmin(TranslatedAdmin):
    model = models.Profile
    list_display = ('title', 'public', 'modified', 'importance')
    inlines = (ProfileMediaAdmin, )
    fields = (
        'title',
        'job_title',
        'owner',
        'avatar',
        'description',
        'text',
        'importance',
        'public',
    )
    search_fields = ('title', 'job_title', 'description')


class AllergyAdmin(TranslatedAdmin):
    model = models.Allergy
    list_display = ('title', )
    search_fields = ('title', )


class DietAdmin(TranslatedAdmin):
    model = models.Diet
    list_display = ('title', )
    search_fields = ('title', )


class HobbyAdmin(TranslatedAdmin):
    model = models.Hobby
    list_display = ('title', )
    search_fields = ('title', )


class FamilyMemberAdmin(NestedStackedInline):
    model = models.FamilyMember
    extra = 0


class FamilyAdmin(BaseAdmin):
    model = models.Family
    list_display = ('title', )
    inlines = (FamilyMemberAdmin, )
    search_fields = (
        'title',
        'owner__first_name',
        'owner__last_name',
        'owner__email',
    )
