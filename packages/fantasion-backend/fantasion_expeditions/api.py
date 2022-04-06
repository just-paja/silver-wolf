from rest_framework.viewsets import ReadOnlyModelViewSet

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
