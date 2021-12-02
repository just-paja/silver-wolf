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
    name = CharField(max_length=127)


class Address(TimeStampedModel):
    country = ForeignKey(
        Country,
        on_delete=CASCADE,
        related_name='addresses',
    )
    city = CharField(max_length=127)
    street = CharField(max_length=255)
    street_number = CharField(max_length=63)
    postal_code = CharField(max_length=63)

    def __str__(self):
        return '{country}, {city}, {street} {street_number}, {postal_code}'.format(
            country=self.country,
            city=self.city,
            street=self.street,
            street_number=self.street_number,
            postal_code=self.postal_code,
        )



class Location(TimeStampedModel):
    name = CharField(max_length=63)
    address = ForeignKey(
        Address,
        blank=True,
        null=True,
        on_delete=CASCADE,
        related_name='locations',
    )
    lat = DecimalField(
        blank=True,
        decimal_places=6,
        max_digits=9,
        null=True,
        verbose_name=_('Latitude'),
    )
    lng = DecimalField(
        blank=True,
        decimal_places=6,
        max_digits=9,
        null=True,
        verbose_name=_('Longitude'),
    )

    def __str__(self):
        return self.name
