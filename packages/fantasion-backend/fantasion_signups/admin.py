from datetime import date

from fantasion_generics.admin import BaseAdmin
from nested_admin import NestedStackedInline

from . import models


class ParticipantAllergy(NestedStackedInline):
    model = models.ParticipantAllergy
    extra = 0
    autocomplete_fields = ('allergy',)


class ParticipantHobby(NestedStackedInline):
    model = models.ParticipantHobby
    extra = 0
    autocomplete_fields = ('hobby',)


class ParticipantAdmin(BaseAdmin):
    model = models.Participant
    inlines = (ParticipantAllergy, ParticipantHobby)
    search_fields = ('first_name', 'last_name', 'birthdate')
    list_display = (
        'pk',
        'first_name',
        'last_name',
        'created',
    )


class SignupDocumentTypeAdmin(BaseAdmin):
    model = models.SignupDocumentType
    list_display = (
        'title',
        'required',
        'modified',
    )
    list_filter = ('required', )


class SignupDocumentMediaAdmin(NestedStackedInline):
    model = models.SignupDocumentMedia
    extra = 0
    readonly_fields = (
        'width',
        'height',
    )


class SignupDocumentAdmin(BaseAdmin):
    model = models.SignupDocument
    inlines = (SignupDocumentMediaAdmin, )


class SignupDocumentInlineAdmin(NestedStackedInline):
    model = models.SignupDocument
    inlines = (SignupDocumentMediaAdmin, )
    extra = 0


class SignupAdmin(BaseAdmin):
    model = models.Signup
    inlines = (SignupDocumentInlineAdmin, )
    list_display = (
        'participant_name',
        'status',
        'expedition',
        'date_range',
        'age_group',
        'participant_age',
        'submitted_at',
    )
    list_filter = (
        'troop__batch__expedition',
        'troop__batch',
        'troop__age_group',
        'status',
    )
    search_fields = (
        'participant__name',
        'family__title',
        'family__owner__email',
        'family__owner__first_name',
        'family__owner__last_name',
        'family__members__user__email',
        'family__members__user__first_name',
        'family__members__user__last_name',
    )

    def age_group(self, inst):
        return inst.troop.age_group

    def date_range(self, inst):
        return '{starts_at} - {ends_at}'.format(
            starts_at=inst.troop.batch.starts_at,
            ends_at=inst.troop.batch.ends_at,
        )

    def expedition(self, inst):
        return inst.troop.batch.expedition

    def participant_name(self, inst):
        return str(inst.participant)

    def participant_age(self, inst):
        today = date.today()
        born = inst.participant.birthdate
        over = 0
        if (today.month, today.day) < (born.month, born.day):
            over = 1
        return today.year - born.year - over

    participant_age.admin_order_field = 'participant__birthdate'
