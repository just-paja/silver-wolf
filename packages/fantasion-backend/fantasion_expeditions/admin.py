from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

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



class BatchAgeGroupAdmin(NestedStackedInline):
    model = models.BatchAgeGroup
    extra = 0


class BatchStaffAdmin(NestedStackedInline):
    model = models.BatchStaff
    extra = 0


class ExpeditionBatchAdmin(BaseAdmin):
    model = models.ExpeditionBatch
    inlines = (BatchAgeGroupAdmin, BatchStaffAdmin)
    list_display = (
        '__str__',
        'expedition',
        'leisure_centre',
        'starts_at',
        'ends_at',
        'modified',
    )
    list_filter = (
        'expedition',
    )
