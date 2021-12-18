from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

from fantasion_eshop.models import ProductPrice
from . import models


class AgeGroup(BaseAdmin):
    model = models.AgeGroup
    list_display = ('title', 'age_min', 'age_max', 'modified')


class StaffRoleMediaAdmin(NestedStackedInline):
    model = models.StaffRoleMedia
    extra = 0


class StaffRole(BaseAdmin):
    model = models.StaffRole
    list_display = ('title', 'modified')
    inlines = (StaffRoleMediaAdmin,)


class LeisureCentreMediaAdmin(NestedStackedInline):
    model = models.LeisureCentreMedia
    extra = 0


class LeisureCentreAdmin(BaseAdmin):
    model = models.LeisureCentre
    list_display = ('title', 'location', 'modified')
    inlines = (LeisureCentreMediaAdmin,)


class ExpeditionMediaAdmin(NestedStackedInline):
    model = models.ExpeditionMedia
    extra = 0


class ExpeditionAdmin(BaseAdmin):
    model = models.Expedition
    list_display = (
        'title',
        'modified',
    )
    inlines = (ExpeditionMediaAdmin,)


class ExpeditionProgramMediaAdmin(NestedStackedInline):
    model = models.ExpeditionProgramMedia
    extra = 0


class ExpeditionProgramAdmin(BaseAdmin):
    model = models.ExpeditionProgram
    list_display = (
        'title',
        'modified',
    )
    inlines = (ExpeditionProgramMediaAdmin,)


class ProductPriceAdmin(NestedStackedInline):
    model = ProductPrice
    extra = 0


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
        'modified',
    )
    list_filter = (
        'expedition',
    )
