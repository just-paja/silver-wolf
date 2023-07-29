from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_people.constants import FAMILY_ROLE_SPECTATOR
from fantasion_generics.api import PublicInfoViewSet

from . import models, serializers


class LeisureCentreCollection(PublicInfoViewSet):
    queryset = models.LeisureCentre.objects
    serializer_class = serializers.LeisureCentreSerializer


class ExpeditionThemeCollection(PublicInfoViewSet):
    queryset = models.ExpeditionTheme.objects
    serializer_class = serializers.ExpeditionThemeSerializer


class ExpeditionCollection(PublicInfoViewSet):
    queryset = models.Expedition.objects
    serializer_class = serializers.ExpeditionSerializer


class ExpeditionBatchCollection(PublicInfoViewSet):
    queryset = models.ExpeditionBatch.objects
    serializer_class = serializers.ExpeditionBatchSerializer


class TransportCollection(PublicInfoViewSet):
    queryset = models.Transport.objects
    serializer_class = serializers.TransportStandaloneSerializer


class ExpeditionLogArticleCollection(ReadOnlyModelViewSet):

    def get_queryset(self):
        user = self.request.user
        query = models.ExpeditionLogArticle.objects.distinct()
        if not user.has_perm(
                'fantasion_expeditions.can_view_expeditionlogarticle'):
            troop_ids, batch_ids = user.get_accessible_troops_and_batch_ids(
                FAMILY_ROLE_SPECTATOR)
            query = query.filter(
                Q(troop_id__in=troop_ids) | Q(troop_id__isnull=True),
                batch_id__in=batch_ids,
            )
        return query

    serializer_class = serializers.ExpeditionLogArticleSerializer
    permission_classes = [IsAuthenticated]
