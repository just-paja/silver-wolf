
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

from fantasion_generics.titles import TitleField
from fantasion_generics.models import MediaObjectModel, NamedModel, PublicModel
from fantasion_locations.models import Address, Location


"""
LeisureCentre represents a base of operations for Expedition. A typical 
LeisureCentre consists of accomodation, kitchen and it is located on a map.
"""
class LeisureCentre(PublicModel):
    location = ForeignKey(
        Location,
        help_text=_('This location will be posted on the map and used for navigation.'),
        related_name='leisure_centres',
        on_delete=RESTRICT,
    )
    mailing_address = ForeignKey(
        Address,
        blank=True,
        help_text=_('This location will be used as a postal address, instruct people to mail here.'),
        null=True,
        related_name='leisure_centres',
        on_delete=RESTRICT,
    )
    website = URLField(
        blank=True,
        max_length=255,
        null=True,
    )


class LeisureCentreMedia(MediaObjectModel):
    parent = ForeignKey(
        LeisureCentre,
        related_name='media',
        on_delete=CASCADE,
    )


"""
Expedition represents an entire summer camp, it is composed of Expedition
batches. People do not sign up for the expedition, but for the Expedition
batch. Each Expedition has a name and description.
"""
class Expedition(PublicModel):
    pass


"""
ExpeditionBatch represents a single batch of the Expedition, it has a start
and end date. Each ExpeditionBatch has different staff.
"""
class ExpeditionBatch(TimeStampedModel):
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
    starts_at = DateField()
    ends_at = DateField()

    def __str__(self):
        return '{expedition_title} ({starts_at} - {ends_at})'.format(
            expedition_title=self.expedition.title,
            starts_at=self.starts_at,
            ends_at=self.ends_at,
        )


"""
AgeGroup represents a category of children ages that can be put together on
an Expedition. This usually shapes the program due to physical and mental
differences in certain age groups.
"""
class AgeGroup(TimeStampedModel):
    title = TitleField()
    age_min = PositiveIntegerField(verbose_name=_('Minimal age'))
    age_max = PositiveIntegerField(verbose_name=_('Maximal age'))

    class Meta:
        ordering = ['age_min', 'age_max', 'title']

    def __str__(self):
        return '{title} ({age_min} - {age_max})'.format(
            title=self.title,
            age_min=self.age_min,
            age_max=self.age_max,
        )


class BatchAgeGroup(TimeStampedModel):
    batch = ForeignKey(
        ExpeditionBatch,
        on_delete=CASCADE,
        related_name='age_groups',
    )
    age_group = ForeignKey(
        AgeGroup,
        on_delete=RESTRICT,
        related_name='age_group_batches',
    )
    starts_at = DateField()
    ends_at = DateField()


    class Meta:
        unique_together = ('batch', 'age_group')


