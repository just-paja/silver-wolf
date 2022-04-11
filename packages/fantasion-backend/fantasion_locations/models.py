from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from django.db.models import (
    DecimalField,
    ForeignKey,
    CharField,
    Model,
    CASCADE,
)


class Country(Model):
    class Meta:
        verbose_name = _('Country')
        verbose_name_plural = _('Countries')

    name = CharField(
        max_length=127,
        unique=True,
        verbose_name=_('Country name'),
    )
    code = CharField(
        max_length=3,
        unique=True,
        verbose_name=_('Country code'),
    )

    def __str__(self):
        return self.name


class Address(Model):
    class Meta:
        abstract = True

    city = CharField(
        blank=True,
        max_length=127,
        null=True,
        verbose_name=_('City'),
    )
    street = CharField(
        blank=True,
        max_length=255,
        null=True,
        verbose_name=_('Street'),
    )
    street_number = CharField(
        blank=True,
        max_length=63,
        null=True,
        verbose_name=_('Street number'),
    )
    postal_code = CharField(
        blank=True,
        max_length=63,
        null=True,
        verbose_name=_('Postal code'),
    )


class Location(TimeStampedModel, Address):
    class Meta:
        verbose_name = _('Location')
        verbose_name_plural = _('Locations')

    name = CharField(
        max_length=63,
        verbose_name=_('Name'),
    )
    country = ForeignKey(
        Country,
        blank=True,
        null=True,
        on_delete=CASCADE,
        related_name='addresses',
        verbose_name=_('Country'),
    )
    fuzzy_name = CharField(
        blank=True,
        max_length=63,
        null=True,
        verbose_name=_('Fuzzy name'),
    )
    lat = DecimalField(
        blank=True,
        decimal_places=17,
        max_digits=20,
        null=True,
        verbose_name=_('Latitude'),
    )
    lng = DecimalField(
        blank=True,
        decimal_places=17,
        max_digits=20,
        null=True,
        verbose_name=_('Longitude'),
    )

    def __str__(self):
        return self.name
