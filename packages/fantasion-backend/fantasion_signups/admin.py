from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

from . import models


class ParticipantAdmin(BaseAdmin):
    model = models.Participant


class SignupDocumentTypeAdmin(BaseAdmin):
    model = models.SignupDocumentType
    list_display = (
        'title',
        'required',
        'modified',
    )
    list_filter = ('required',)


class SignupDocumentMediaAdmin(NestedStackedInline):
    model = models.SignupDocumentMedia
    extra = 0
    readonly_fields = ('width', 'height',)


class SignupDocumentAdmin(BaseAdmin):
    model = models.SignupDocument
    inlines = (SignupDocumentMediaAdmin,)


class SignupDocumentInlineAdmin(NestedStackedInline):
    model = models.SignupDocument
    inlines = (SignupDocumentMediaAdmin,)
    extra = 0


class SignupAdmin(BaseAdmin):
    model = models.Signup
    inlines = (SignupDocumentInlineAdmin,)
    list_display = (
        'participant_name',
        'status',
        'expedition',
        'date_range',
        'age_group',
        'submitted_at',
    )
    list_filter = (
        'batch_age_group__batch__expedition',
        'batch_age_group__batch',
        'batch_age_group__age_group',
        'status',
    )

    def age_group(self, inst):
        return inst.batch_age_group.age_group

    def date_range(self, inst):
        return '{starts_at} - {ends_at}'.format(
            starts_at=inst.batch_age_group.batch.starts_at,
            ends_at=inst.batch_age_group.batch.ends_at,
        )

    def expedition(self, inst):
        return inst.batch_age_group.batch.expedition

    def participant_name(self, inst):
        return inst.participant.name
