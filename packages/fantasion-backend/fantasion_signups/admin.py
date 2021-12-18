from fantasion_generics.admin import BaseAdmin

from . import models


class ParticipantAdmin(BaseAdmin):
    model = models.Participant


class SignupAdmin(BaseAdmin):
    model = models.Signup
    list_display = (
        'participant_name',
        'status',
        'expedition',
        'date_range',
        'age_group',
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
