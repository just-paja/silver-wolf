from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

from . import models


class AgeGroup(BaseAdmin):
    model = models.AgeGroup
    list_display = ('title', 'age_min', 'age_max', 'modified')


class LeisureCentreAdmin(BaseAdmin):
    model = models.LeisureCentre
    list_display = ('title', 'location', 'modified')


class ExpeditionAdmin(BaseAdmin):
    model = models.Expedition
    list_display = (
        'title',
        'modified',
    )


class BatchAgeGroupAdmin(NestedStackedInline):
    model = models.BatchAgeGroup
    extra = 0


class ExpeditionBatchAdmin(BaseAdmin):
    model = models.ExpeditionBatch
    inlines = (BatchAgeGroupAdmin,)
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