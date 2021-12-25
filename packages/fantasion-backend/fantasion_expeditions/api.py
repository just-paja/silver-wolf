from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_locations.api import LocationSerializer
from fantasion_generics.api import media_fields

from . import models


class LeisureCentreMediaSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.LeisureCentreMedia
        fields = media_fields


class LeisureCentreSerializer(HyperlinkedModelSerializer):
    location = LocationSerializer()
    mailing_address = LocationSerializer()
    media = LeisureCentreMediaSerializer(many=True)

    class Meta:
        model = models.LeisureCentre
        fields = (
            'description',
            'id',
            'location',
            'mailing_address',
            'media',
            'slug',
            'title',
        )


class ExpeditionMediaSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.ExpeditionMedia
        fields = media_fields


class ExpeditionSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Expedition
        fields = (
            'id',
            'description',
            'media',
            'slug',
        )


class LeisureCentreCollection(ReadOnlyModelViewSet):
    queryset = models.LeisureCentre.objects.all()
    serializer_class = LeisureCentreSerializer


class ExpeditionCollection(ReadOnlyModelViewSet):
    queryset = models.Expedition.objects.all()
    serializer_class = ExpeditionSerializer
