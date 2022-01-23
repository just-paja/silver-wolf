from fantasion_generics.admin import BaseAdmin, MediaAdmin
from nested_admin import NestedStackedInline
from modeltranslation.admin import TranslationAdmin

from fantasion_eshop.models import ProductPrice
from . import models


class AgeGroup(BaseAdmin, TranslationAdmin):
    model = models.AgeGroup
    list_display = ('title', 'age_min', 'age_max', 'modified')


class StaffRoleMediaAdmin(MediaAdmin):
    model = models.StaffRoleMedia


class StaffRole(BaseAdmin, TranslationAdmin):
    model = models.StaffRole
    list_display = ('title', 'modified')
    inlines = (StaffRoleMediaAdmin,)


class LeisureCentreMediaAdmin(MediaAdmin):
    model = models.LeisureCentreMedia


class LeisureCentreAdmin(BaseAdmin, TranslationAdmin):
    model = models.LeisureCentre
    list_display = ('title', 'location', 'modified')
    inlines = (LeisureCentreMediaAdmin,)


class ExpeditionMediaAdmin(MediaAdmin):
    model = models.ExpeditionMedia


class ExpeditionAdmin(BaseAdmin, TranslationAdmin):
    model = models.Expedition
    list_display = (
        'title',
        'modified',
        'public',
    )
    list_filter = ('public',)
    inlines = (ExpeditionMediaAdmin,)


class ExpeditionProgramMediaAdmin(MediaAdmin):
    model = models.ExpeditionProgramMedia


class ExpeditionProgramAdmin(BaseAdmin, TranslationAdmin):
    model = models.ExpeditionProgram
    list_display = (
        'title',
        'modified',
    )
    inlines = (ExpeditionProgramMediaAdmin,)


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
    readonly_fields = ('description',)
    inlines = (ProductPriceAdmin,)

    def expedition(self, instance):
        return instance.batch.expedition


class BatchAgeGroupInlineAdmin(NestedStackedInline):
    model = models.BatchAgeGroup
    extra = 0
    inlines = (ProductPriceAdmin,)
    readonly_fields = ('description',)


class BatchStaffAdmin(NestedStackedInline):
    model = models.BatchStaff


class ExpeditionBatchAdmin(BaseAdmin):
    model = models.ExpeditionBatch
    inlines = (BatchAgeGroupInlineAdmin, BatchStaffAdmin)
    list_display = (
        'pk',
        'expedition',
        'leisure_centre',
        'starts_at',
        'ends_at',
        'modified',
    )
    list_filter = (
        'expedition',
    )
