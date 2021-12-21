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
    name = CharField(
        max_length=127,
        unique=True,
    )

    def __str__(self):
        return self.name


class Location(TimeStampedModel):
    name = CharField(max_length=63)
    country = ForeignKey(
        Country,
        blank=True,
        null=True,
        on_delete=CASCADE,
        related_name='addresses',
    )
    city = CharField(
        blank=True,
        max_length=127,
        null=True,
    )
    street = CharField(
        blank=True,
        max_length=255,
        null=True,
    )
    street_number = CharField(
        blank=True,
        max_length=63,
        null=True,
    )
    postal_code = CharField(
        blank=True,
        max_length=63,
        null=True,
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
