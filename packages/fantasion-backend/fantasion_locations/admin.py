from fantasion_generics.admin import BaseAdmin

from . import models


class AddressAdmin(BaseAdmin):
    model = models.Address


class CountryAdmin(BaseAdmin):
    model = models.Country


class LocationAdmin(BaseAdmin):
    model = models.Location
