from fantasion_generics.admin import TranslatedAdmin

from . import models


class CountryAdmin(TranslatedAdmin):
    model = models.Country
    list_display = ('name', )
    search_fields = ('name', )


class LocationAdmin(TranslatedAdmin):
    model = models.Location
    list_display = (
        'name',
        'city',
        'street_and_number',
        'postal_code',
        'coordinates',
    )
    list_filter = ('country', )
    search_fields = (
        'name',
        'city',
        'country__name',
    )
    autocomplete_fields = ('country', )

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
