from django.urls import include, path
from rest_framework import routers

from fantasion_locations import api as locations

router = routers.DefaultRouter()
router.register(
    r'countries',
    locations.CountryCollection,
    basename='countries',
)
router.register(
    r'locations',
    locations.LocationCollection,
    basename='locations',
)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls', namespace='rest_framework'))
]
