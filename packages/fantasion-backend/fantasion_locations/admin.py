from fantasion_generics.admin import BaseAdmin

from . import models


class CountryAdmin(BaseAdmin):
    model = models.Country
    list_display = ('name',)


class LocationAdmin(BaseAdmin):
    model = models.Location
