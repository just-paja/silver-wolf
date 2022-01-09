from fantasion_generics.admin import BaseAdmin

from . import models


class CountryAdmin(BaseAdmin):
    model = models.Country
    list_display = ('name', )


class LocationAdmin(BaseAdmin):
    model = models.Location
    list_display = (
        'name',
        'city',
        'street_and_number',
        'postal_code',
        'coordinates',
    )
    list_filter = ('country', )

    def street_and_number(self, inst):
        if not inst.street:
            return None
        return "{street} {number}".format(
            street=inst.street,
            number=inst.street_number,
        )

    def coordinates(self, inst):
        if not inst.lat:
            return None
        return "{lat}, {lng}".format(
            lat=inst.lat,
            lng=inst.lng,
        )
