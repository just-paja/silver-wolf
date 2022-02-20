from django.urls import include, path
from rest_framework import routers

from fantasion_content import api as content
from fantasion_locations import api as locations
from fantasion_expeditions import api as expeditions
from fantasion_people import api as people

from . import users


class NoSlashRouter(routers.DefaultRouter):

    def __init__(self):
        super().__init__()
        self.trailing_slash = ''


router = NoSlashRouter()
router.register(
    r'static-articles',
    content.StaticArticleView,
    basename='static_article',
)
router.register(
    r'countries',
    locations.CountryCollection,
    basename='countries',
)
router.register(
    r'flavour-texts',
    content.FlavourTextView,
    basename='flavour_text',
)
router.register(
    r'faqs',
    content.FrequentlyAskedQuestionView,
    basename='faqs',
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
    r'expedition-themes',
    expeditions.ExpeditionThemeCollection,
    basename='expedition_themes',
)
router.register(
    r'leisure-centres',
    expeditions.LeisureCentreCollection,
    basename='leisure_centres',
)
router.register(
    r'profiles',
    people.ProfileCollection,
    basename='profiles',
)

urlpatterns = [
    path('', include(router.urls)),
    path('users/', include(users.urlpatterns)),
    path('auth/', include('rest_framework.urls', namespace='rest_framework'))
]
