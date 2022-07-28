from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_people.constants import FAMILY_ROLE_SPECTATOR
from . import models, serializers


class LeisureCentreCollection(ReadOnlyModelViewSet):
    queryset = models.LeisureCentre.objects.all()
    serializer_class = serializers.LeisureCentreSerializer


class ExpeditionThemeCollection(ReadOnlyModelViewSet):
    queryset = models.ExpeditionTheme.objects.all()
    serializer_class = serializers.ExpeditionThemeSerializer


class ExpeditionCollection(ReadOnlyModelViewSet):
    queryset = models.Expedition.objects.filter(public=True).all()
    serializer_class = serializers.ExpeditionSerializer


class ExpeditionBatchCollection(ReadOnlyModelViewSet):
    queryset = models.ExpeditionBatch.objects.filter(public=True).all()
    serializer_class = serializers.ExpeditionBatchSerializer


class TransportCollection(ReadOnlyModelViewSet):
    queryset = models.Transport.objects.filter(public=True).all()
    serializer_class = serializers.TransportStandaloneSerializer


class ExpeditionLogArticleCollection(ReadOnlyModelViewSet):

    def get_queryset(self):
        user = self.request.user
        query = models.ExpeditionLogArticle.objects.get_queryset()
        if not user.has_perm(
                'fantasion_expeditions.can_view_expeditionlogarticle'):
            batch_ids, troop_ids = user.get_accessible_troops_and_batch_ids(
                FAMILY_ROLE_SPECTATOR)
            query = query.filter(
                Q(troop_id__in=troop_ids) | Q(troop_id__isnull=True),
                batch_id__in=batch_ids,
            )
        return query

    serializer_class = serializers.ExpeditionLogArticleSerializer
    permission_classes = [IsAuthenticated]
