from django.urls import include, path
from rest_framework import routers

from fantasion_locations import api as locations
from fantasion_expeditions import api as expeditions


class NoSlashRouter(routers.DefaultRouter):
    def __init__(self):
        super().__init__()
        self.trailing_slash = ''


router = NoSlashRouter()
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
router.register(
    r'expeditions',
    expeditions.ExpeditionCollection,
    basename='expedition',
)
router.register(
    r'expedition-batches',
    expeditions.ExpeditionBatchCollection,
    basename='expedition_batches',
)
router.register(
    r'leisure-centres',
    expeditions.LeisureCentreCollection,
    basename='leisure_centres',
)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls', namespace='rest_framework'))
]
