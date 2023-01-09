from datetime import date

from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic.detail import DetailView
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from nested_admin import NestedStackedInline

from fantasion_generics.admin import BaseAdmin
from fantasion_generics.filters import YearFilter

from . import models


class ParticipantYearFilter(YearFilter):
    accept_null = False
    current = True
    filter_fields = (
        'signups__troop__batch__starts_at',
        'signups__troop__batch__ends_at',
    )


class SignupYearFilter(YearFilter):
    current = True
    filter_fields = ('troop__batch__starts_at', 'troop__batch__ends_at')


class ParticipantAllergy(NestedStackedInline):
    model = models.ParticipantAllergy
    extra = 0
    autocomplete_fields = ('allergy', )


class ParticipantDiet(NestedStackedInline):
    model = models.ParticipantDiet
    extra = 0
    autocomplete_fields = ('diet', )


class ParticipantHobby(NestedStackedInline):
    model = models.ParticipantHobby
    extra = 0
    autocomplete_fields = ('hobby', )


class ParticipantDetailView(PermissionRequiredMixin, DetailView):
    permission_required = 'fantasion_signups.view_participant'
    template_name = 'admin/participant/detail.html'
    model = models.Participant
    admin_site = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['original'] = self.object
        context['has_view_permission'] = True
        context['change'] = True
        context = context | self.admin_site.each_context(self.request)
        return context

    get_context_data.verbose_name = _('PK')


class ParticipantAdmin(BaseAdmin):
    model = models.Participant
    inlines = (ParticipantAllergy, ParticipantDiet, ParticipantHobby)
    search_fields = ('first_name', 'last_name', 'birthdate')
    list_filter = (ParticipantYearFilter, )
    list_display = (
        'detail_link',
        'first_name',
        'last_name',
        'created',
    )
    detail_route_name = 'fantasion_signups_participant_detail'

    def get_urls(self):
        return [
            path(
                '<pk>/detail',
                self.admin_site.admin_view(
                    ParticipantDetailView.as_view(
                        admin_site=self.admin_site,
                        extra_context={
                            'opts': self.model._meta,
                        },
                    )),
                name=self.detail_route_name,
            ),
            *super().get_urls(),
        ]

    def detail_link(self, obj):
        url = reverse(f'admin:{self.detail_route_name}', args=[obj.pk])
        return format_html(f'<a href="{url}">{obj.pk}</a>')


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
        SignupYearFilter,
        'troop__batch__expedition',
        'troop__batch',
        'troop__age_group',
        'status',
    )
    search_fields = (
        'participant__first_name',
        'participant__last_name',
        'order__promise__variable_symbol',
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
