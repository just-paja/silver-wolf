from fantasion_generics.admin import BaseAdmin, MediaAdmin, TranslatedAdmin
from nested_admin import NestedStackedInline

from fantasion_eshop.models import ProductPrice
from . import models


class AgeGroup(TranslatedAdmin):
    model = models.AgeGroup
    list_display = ('title', 'age_min', 'age_max', 'modified')


class StaffRoleMediaAdmin(MediaAdmin):
    model = models.StaffRoleMedia


class StaffRole(TranslatedAdmin):
    model = models.StaffRole
    list_display = ('title', 'modified')
    inlines = (StaffRoleMediaAdmin, )


class LeisureCentreMediaAdmin(MediaAdmin):
    model = models.LeisureCentreMedia


class LeisureCentreAdmin(TranslatedAdmin):
    model = models.LeisureCentre
    list_display = ('title', 'location', 'modified')
    inlines = (LeisureCentreMediaAdmin, )
    search_fields = (
        'title',
        'location__title',
    )


class ExpeditionThemeMediaAdmin(MediaAdmin):
    model = models.ExpeditionThemeMedia


class ExpeditionThemeAdmin(TranslatedAdmin):
    model = models.ExpeditionTheme
    list_display = (
        'title',
        'modified',
    )
    inlines = (ExpeditionThemeMediaAdmin, )
    search_fields = ('title', 'description')


class ExpeditionMediaAdmin(MediaAdmin):
    model = models.ExpeditionMedia


class ExpeditionAdmin(TranslatedAdmin):
    model = models.Expedition
    list_display = (
        'title',
        'modified',
        'public',
    )
    list_filter = ('public', )
    fields = (
        'title',
        'theme',
        'description',
        'detailed_description',
        'public',
    )
    inlines = (ExpeditionMediaAdmin, )
    search_fields = ('title', 'description')
    autocomplete_fields = ('theme', )


class ExpeditionProgramMediaAdmin(MediaAdmin):
    model = models.ExpeditionProgramMedia


class ExpeditionProgramAdmin(TranslatedAdmin):
    model = models.ExpeditionProgram
    list_display = (
        'title',
        'modified',
    )
    inlines = (ExpeditionProgramMediaAdmin, )
    search_fields = ('title', 'description')


class ProductPriceAdmin(NestedStackedInline):
    model = ProductPrice


class BatchAgeGroupAdmin(BaseAdmin):
    model = models.BatchAgeGroup
    list_display = (
        'pk',
        'age_group',
        'batch',
        'expedition',
        'program',
        'starts_at',
        'ends_at',
    )
    list_filter = (
        'batch__expedition',
        'age_group',
        'batch',
    )
    readonly_fields = ('description', )
    inlines = (ProductPriceAdmin, )
    autocomplete_fields = ('batch', 'program')

    def expedition(self, instance):
        return instance.batch.expedition


class BatchAgeGroupInlineAdmin(NestedStackedInline):
    model = models.BatchAgeGroup
    extra = 0
    inlines = (ProductPriceAdmin, )
    readonly_fields = ('description', )


class BatchStaffAdmin(NestedStackedInline):
    model = models.BatchStaff
    autocomplete_fields = ('profile', )
    extra = 0


class ExpeditionBatchAdmin(BaseAdmin):
    model = models.ExpeditionBatch
    inlines = (BatchAgeGroupInlineAdmin, BatchStaffAdmin)
    list_display = (
        'pk',
        'expedition',
        'leisure_centre',
        'starts_at',
        'ends_at',
        'public',
        'modified',
    )
    list_filter = (
        'expedition',
        'leisure_centre',
        'public',
    )
    autocomplete_fields = ('expedition', 'leisure_centre')
    search_fields = (
        'expedition__title',
        'expedition__description',
        'starts_at',
    )
