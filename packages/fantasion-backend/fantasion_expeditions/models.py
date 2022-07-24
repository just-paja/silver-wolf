from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    ForeignKey,
    Model,
    PositiveIntegerField,
    URLField,
    CASCADE,
    RESTRICT,
)

from fantasion_eshop.models import EshopProduct
from fantasion_generics.media import MediaParentField
from fantasion_generics.titles import TitleField, FacultativeTitleField
from fantasion_locations.models import Location
from fantasion_generics.models import (
    DetailedDescriptionField,
    MediaObjectModel,
    PublicModel,
    VisibilityField,
)


class LeisureCentre(PublicModel):

    class Meta:
        verbose_name = _('Leisure Centre')
        verbose_name_plural = _('Leisure Centres')

    """
    LeisureCentre represents a base of operations for Expedition. A typical
    LeisureCentre consists of accomodation, kitchen and it is located on a map.
    """
    detailed_description = DetailedDescriptionField()
    location = ForeignKey(
        Location,
        help_text=_(
            'This location will be posted on the map and used for navigation.'
        ),
        on_delete=RESTRICT,
        related_name='leisure_centres',
        verbose_name=_('Location'),
    )
    mailing_address = ForeignKey(
        Location,
        blank=True,
        help_text=_('This location will be used as a postal address,'
                    'instruct people to mail here.'),
        null=True,
        related_name='leisure_centre_mailing_addresses',
        on_delete=RESTRICT,
        verbose_name=_('Mailing address'),
    )
    website = URLField(
        blank=True,
        max_length=255,
        null=True,
        verbose_name=_('Website'),
    )


class LeisureCentreMedia(MediaObjectModel):
    parent = MediaParentField(LeisureCentre)


class ExpeditionTheme(PublicModel):
    """
    ExpeditionTheme represents a theme for the entire expedition.
    """

    class Meta:
        verbose_name = _('Expedition Theme')
        verbose_name_plural = _('Expedition Themes')

    detailed_description = DetailedDescriptionField()


class ExpeditionThemeMedia(MediaObjectModel):
    parent = MediaParentField(ExpeditionTheme)


class Expedition(PublicModel):
    """
    Expedition represents an entire summer camp, it is composed of Expedition
    batches. People do not sign up for the expedition, but for the Expedition
    batch. Each Expedition has a name and description.
    """

    class Meta:
        verbose_name = _('Expedition')
        verbose_name_plural = _('Expeditions')

    detailed_description = DetailedDescriptionField()
    public = VisibilityField()
    theme = ForeignKey(
        ExpeditionTheme,
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name='expeditions',
        verbose_name=_('Expedition Theme'),
    )


class ExpeditionMedia(MediaObjectModel):
    parent = MediaParentField(Expedition)


class ExpeditionBatch(TimeStampedModel):
    """
    ExpeditionBatch represents a single batch of the Expedition, it has a start
    and end date. Each ExpeditionBatch has different staff.
    """

    class Meta:
        verbose_name = _('Expedition Batch')
        verbose_name_plural = _('Expedition Batches')

    expedition = ForeignKey(
        Expedition,
        on_delete=CASCADE,
        related_name='batches',
        verbose_name=_('Expedition'),
    )
    leisure_centre = ForeignKey(
        LeisureCentre,
        on_delete=RESTRICT,
        related_name='expedition_batches',
        verbose_name=_('Leisure Centre'),
    )
    starts_at = DateField(verbose_name=_('Starts at'))
    ends_at = DateField(verbose_name=_('Ends at'))
    public = VisibilityField()

    def __str__(self):
        return '{expedition_title} ({starts_at} - {ends_at})'.format(
            expedition_title=self.expedition.title,
            starts_at=self.starts_at,
            ends_at=self.ends_at,
        )


class StaffRole(PublicModel):

    class Meta:
        verbose_name = _('Staff Role')
        verbose_name_plural = _('Staff Roles')


class StaffRoleMedia(MediaObjectModel):
    parent = MediaParentField(StaffRole, )


class BatchStaff(TimeStampedModel):

    class Meta:
        verbose_name = _('Batch Staff')
        verbose_name_plural = _('Batch Staff')

    batch = ForeignKey(
        ExpeditionBatch,
        on_delete=CASCADE,
        related_name='staff',
        verbose_name=_('Expedition Batch'),
    )
    profile = ForeignKey(
        'fantasion_people.Profile',
        on_delete=RESTRICT,
        related_name='expedition_roles',
        verbose_name=_('Profile'),
    )
    role = ForeignKey(
        StaffRole,
        on_delete=RESTRICT,
        related_name='staff',
        verbose_name=_('Role'),
    )


class AgeGroup(TimeStampedModel):
    """
    AgeGroup represents a category of children ages that can be put together on
    an Expedition. This usually shapes the program due to physical and mental
    differences in certain age groups.
    """

    class Meta:
        ordering = ['age_min', 'age_max', 'title']
        verbose_name = _('Age Group')
        verbose_name_plural = _('Age Groups')

    title = TitleField()
    age_min = PositiveIntegerField(verbose_name=_('Minimal age'))
    age_max = PositiveIntegerField(verbose_name=_('Maximal age'))

    def __str__(self):
        return '{title} ({age_min} - {age_max})'.format(
            title=self.title,
            age_min=self.age_min,
            age_max=self.age_max,
        )


class ExpeditionProgram(PublicModel):
    """
    ExpeditionProgram represents a story or adventure used for an age group on
    the expedition.
    """

    class Meta:
        verbose_name = _('Expedition Program')
        verbose_name_plural = _('Expedition Programs')

    detailed_description = DetailedDescriptionField()


class ExpeditionProgramMedia(MediaObjectModel):
    parent = MediaParentField(ExpeditionProgram, )


class Troop(EshopProduct):
    """
    Troop represents a collective of simillar age expedition
    participants, this is what people get signed up to.
    """

    class Meta:
        unique_together = ('batch', 'age_group', 'starts_at')
        verbose_name = _('Troop')
        verbose_name_plural = _('Troops')

    batch = ForeignKey(
        ExpeditionBatch,
        on_delete=CASCADE,
        related_name='troops',
        verbose_name=_('Expedition Batch'),
    )
    age_group = ForeignKey(
        AgeGroup,
        on_delete=RESTRICT,
        related_name='troops',
        verbose_name=_('Age Group'),
    )
    program = ForeignKey(
        ExpeditionProgram,
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name='troops',
        verbose_name=_('Expedition Program'),
    )
    starts_at = DateField(verbose_name=_('Starts at'))
    ends_at = DateField(verbose_name=_('Ends at'))

    def get_description(self):
        return '{batch}, {age_group}'.format(
            batch=self.batch,
            age_group=self.age_group,
        )


class TransportVehicle(Model):
    """
    TransportVehicle represents a car, bus or another kind of vehicle used
    as a Transport.
    """

    class Meta:
        verbose_name = _('Transport Vehicle')
        verbose_name_plural = _('Transport Vehicles')

    title = FacultativeTitleField()
    brand = CharField(
        blank=True,
        null=True,
        max_length=128,
        verbose_name=_('Vehicle Brand'),
    )
    model = CharField(
        blank=True,
        null=True,
        max_length=128,
        verbose_name=_('Vehicle Model'),
    )
    year = PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name=_('Vehicle Manufactured Year'),
    )
    color = CharField(
        blank=True,
        null=True,
        max_length=128,
        verbose_name=_('Vehicle Colour'),
    )
    public = VisibilityField()
    description = DetailedDescriptionField()

    def __str__(self):
        if self.title:
            return f'{self.title} ({self.brand} {self.model})'
        return f'{self.brand} {self.model}'


class TransportVehicleMedia(MediaObjectModel):
    parent = MediaParentField(TransportVehicle)


class Transport(Model):
    """
    Transport represents a planned journey used to transport expedition
    participants to or from an expedition, or any other related kind of
    expedition related trip.
    """

    class Meta:
        verbose_name = _('Transport')
        verbose_name_plural = _('Transports')

    description = DetailedDescriptionField()
    departs_from = ForeignKey(
        'fantasion_locations.Location',
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name='expedition_transports',
        verbose_name=_('Departs from'),
    )
    departs_at = DateTimeField(
        blank=True,
        null=True,
        verbose_name=_('Departs at'),
    )
    vehicle = ForeignKey(
        TransportVehicle,
        blank=True,
        null=True,
        on_delete=RESTRICT,
        verbose_name=_('Transport Vehicle'),
    )
    arrives_to = ForeignKey(
        'fantasion_locations.Location',
        blank=True,
        null=True,
        on_delete=RESTRICT,
        related_name='expedition_transport_destinations',
        verbose_name=_('Arrives to'),
    )
    arrives_at = DateTimeField(
        blank=True,
        null=True,
        verbose_name=_('Arrives at'),
    )
    gps_tracking_url = URLField(
        blank=True,
        null=True,
        help_text=_(
            ('Tracking URL will be published until the transport arrives to'
             'the destination')),
        verbose_name=_('GPS Tracking URL'),
    )
    boarding = BooleanField(
        default=False,
        help_text=_('The transport is boarding at the moment'),
        verbose_name=_('Boarding'),
    )
    departed = BooleanField(
        default=False,
        help_text=_('The transport has departed'),
        verbose_name=_('Departed'),
    )
    arrived = BooleanField(
        default=False,
        help_text=_('The transport has reached the destination'),
        verbose_name=_('Arrived'),
    )
    public = VisibilityField()

    def __str__(self):
        if self.vehicle:
            return f'{self.vehicle}, {self.departs_from} {self.departs_at}'
        return f'{self.departs_from} {self.departs_at}'


class TroopTransport(TimeStampedModel):
    troop = ForeignKey(
        Troop,
        on_delete=CASCADE,
        related_name='troop_transports',
        verbose_name=_('Troop'),
    )
    transport = ForeignKey(
        Transport,
        on_delete=RESTRICT,
        related_name='troop_transports',
        verbose_name=_('Transport'),
    )
