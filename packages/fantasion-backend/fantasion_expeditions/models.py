from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from django.db.models import (
    DateField,
    ForeignKey,
    PositiveIntegerField,
    URLField,
    CASCADE,
    RESTRICT,
)

from fantasion_eshop.models import EshopProduct
from fantasion_generics.titles import TitleField
from fantasion_generics.media import MediaParentField
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


class BatchAgeGroup(EshopProduct):
    """
    BatchAgeGroup represents a collective of simillar age expedition
    participants, this is what people get signed up to.
    """
    class Meta:
        unique_together = ('batch', 'age_group', 'starts_at')
        verbose_name = _('Batch Age Group')
        verbose_name_plural = _('Batch Age Groups')

    batch = ForeignKey(
        ExpeditionBatch,
        on_delete=CASCADE,
        related_name='age_groups',
        verbose_name=_('Expedition Batch'),
    )
    age_group = ForeignKey(
        AgeGroup,
        on_delete=RESTRICT,
        related_name='age_group_batches',
        verbose_name=_('Age Group'),
    )
    program = ForeignKey(
        ExpeditionProgram,
        on_delete=RESTRICT,
        related_name='age_group_batches',
        verbose_name=_('Expedition Program'),
    )
    starts_at = DateField(verbose_name=_('Starts at'))
    ends_at = DateField(verbose_name=_('Ends at'))

    def get_description(self):
        return '{batch}, {age_group}'.format(
            batch=self.batch,
            age_group=self.age_group,
        )
