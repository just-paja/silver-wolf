import io
import csv

from datetime import date
from django.http import HttpResponse
from django.urls import path
from django.utils.translation import gettext_lazy as _
from nested_admin import NestedStackedInline
from fantasion_generics.admin import BaseAdmin, MediaAdmin, TranslatedAdmin
from fantasion_generics.filters import YearFilter

from fantasion_eshop.models import ProductPrice
from fantasion_signups.models import Signup
from . import models


class AgeGroup(TranslatedAdmin):
    model = models.AgeGroup
    list_display = ('title', 'age_min', 'age_max', 'modified')


class TimeLimitedYearFilter(YearFilter):
    filter_fields = ('starts_at', 'ends_at')


class TransportYearFilter(YearFilter):
    filter_fields = ('departs_at', 'arrives_at')


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
        'location__name',
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
        'visibility',
    )
    list_filter = ('visibility', )
    fields = (
        'title',
        'theme',
        'description',
        'detailed_description',
        'visibility',
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
    extra = 0
    search_fields = ('product__title', 'price_level__title')


class TroopTransportInlineAdmin(NestedStackedInline):
    model = models.TroopTransport
    extra = 0
    autocomplete_fields = ('transport', 'troop')


class TroopAdmin(BaseAdmin):
    model = models.Troop
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
        TimeLimitedYearFilter,
        'batch__expedition',
        'age_group',
        'batch',
        'program',
    )
    readonly_fields = ('description', )
    inlines = (ProductPriceAdmin, TroopTransportInlineAdmin)
    autocomplete_fields = ('batch', 'program')
    search_fields = (
        'batch__expedition__title',
        'program__title',
        'age_group__title',
        'starts_at',
        'ends_at',
        'price_includes',
    )

    def expedition(self, instance):
        return instance.batch.expedition


class TroopInlineAdmin(NestedStackedInline):
    model = models.Troop
    extra = 0
    inlines = (
        ProductPriceAdmin,
        TroopTransportInlineAdmin,
    )
    readonly_fields = ('description', )


class BatchStaffAdmin(NestedStackedInline):
    model = models.BatchStaff
    autocomplete_fields = ('profile', )
    extra = 0


class ExpeditionBatchAdmin(BaseAdmin):
    model = models.ExpeditionBatch
    inlines = (TroopInlineAdmin, BatchStaffAdmin)
    list_display = (
        'pk',
        'expedition',
        'leisure_centre',
        'starts_at',
        'ends_at',
        'visibility',
        'modified',
    )
    list_filter = (
        TimeLimitedYearFilter,
        'expedition',
        'leisure_centre',
        'visibility',
    )
    autocomplete_fields = ('expedition', 'leisure_centre')
    change_form_template = 'admin/expeditionbatch_change_form.html'
    search_fields = (
        'expedition__title',
        'expedition__description',
        'starts_at',
    )

    def get_urls(self):
        return super().get_urls() + [
            path(
                '<expeditionbatch_id>/exports/thorough',
                self.admin_site.admin_view(self.export_thorough),
                name='expeditionbatch_export_thorough',
            ),
        ]

    def concat_trait(self, collection, name):
        return ', '.join([getattr(item, name).title for item in collection])

    def get_age(self, born):
        today = date.today()
        leap = ((today.month, today.day) < (born.month, born.day))
        return today.year - born.year - leap

    def format_address(self, address):
        if not address:
            return ''
        return (f"{address.street} {address.street_number}, "
                f"{address.postal_code} {address.city}")

    def export_thorough(self, request, expeditionbatch_id):
        batch = models.ExpeditionBatch.objects.filter(
            pk=expeditionbatch_id).get()
        signups = Signup.objects.filter(troop__batch=batch)
        data = [[
            _('Signup ID'),
            _('Order ID'),
            _('Signup Status'),
            _('Age Group'),
            _('First name'),
            _('Last name'),
            _('Birth date'),
            _('Age'),
            _('Parent'),
            _('Parent phone'),
            _('Parent e-mail'),
            _('Address'),
            _('Note'),
            _('Allergies'),
            _('Diets'),
        ]]
        for signup in signups.all():
            data.append([
                signup.id,
                signup.order.id,
                signup.get_status_display(),
                signup.troop.age_group.title,
                signup.participant.first_name,
                signup.participant.last_name,
                signup.participant.birthdate,
                self.get_age(signup.participant.birthdate),
                ' '.join([
                    signup.participant.family.owner.first_name,
                    signup.participant.family.owner.last_name,
                ]),
                signup.participant.family.owner.phone,
                signup.participant.family.owner.email,
                self.format_address(signup.order.invoice_address),
                signup.note,
                self.concat_trait(
                    signup.participant.participant_allergies.all(),
                    'allergy',
                ),
                self.concat_trait(
                    signup.participant.participant_diets.all(),
                    'diet',
                ),
            ])

        buffer = io.StringIO()
        wr = csv.writer(buffer, quoting=csv.QUOTE_ALL)
        wr.writerows(data)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='text/csv; charset=utf-8')
        disposition = f'attachment; filename=dukladny-prehled-{batch.pk}.csv'
        response['Content-Disposition'] = disposition
        return response


class TransportVehicleMediaAdmin(MediaAdmin):
    model = models.TransportVehicleMedia


class TransportVehicleAdmin(TranslatedAdmin):
    model = models.TransportVehicle
    inlines = (TransportVehicleMediaAdmin, )
    list_display = ('pk', 'title', 'brand', 'model', 'color', 'year')
    list_filter = ('brand', 'model', 'color', 'year')
    search_fields = ('title', 'brand', 'model', 'color', 'year')
    fields = (
        'title',
        'brand',
        'model',
        'year',
        'color',
        'visibility',
        'description',
    )


class TransportAdmin(TranslatedAdmin):
    model = models.Transport
    inlines = (TroopTransportInlineAdmin, )
    list_display = (
        'pk',
        'status',
        'vehicle',
        'departs_from',
        'departs_at',
        'arrives_to',
        'arrives_at',
        'visibility',
    )
    list_filter = (TransportYearFilter, 'vehicle', 'status')
    search_fields = ('departs_from__name', 'arrives_to__name')
    autocomplete_fields = ('arrives_to', 'departs_from', 'vehicle')
    fields = (
        'departs_from',
        'departs_at',
        'arrives_to',
        'arrives_at',
        'vehicle',
        'gps_tracking_url',
        'status',
        'visibility',
        'description',
    )


class ExpeditionLogArticleMediaAdmin(MediaAdmin):
    model = models.ExpeditionLogArticleMedia


class ExpeditionLogArticleAdmin(TranslatedAdmin):
    model = models.ExpeditionLogArticle
    inlines = (ExpeditionLogArticleMediaAdmin, )
    list_display = ('date', 'title', 'visibility')
    list_filter = ('batch', 'troop', 'visibility')
    search_fields = ('title', 'text')
    fields = (
        'batch',
        'troop',
        'date',
        'title',
        'text',
    )
    autocomplete_fields = ('batch', 'troop')
