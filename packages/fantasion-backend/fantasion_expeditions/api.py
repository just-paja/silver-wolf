from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.serializers import (
    HyperlinkedModelSerializer,
    HyperlinkedIdentityField,
)

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


class AgeGroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.AgeGroup
        fields = (
            'age_max',
            'age_min',
            'id',
            'title',
        )


class ExpeditionProgramMediaSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.ExpeditionProgramMedia
        fields = media_fields


class ExpeditionProgramSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.ExpeditionProgram
        fields = (
            'id',
            'title',
            'description',
            'media',
        )


class BatchAgeGroupSerializer(HyperlinkedModelSerializer):
    age_group = AgeGroupSerializer()
    program = ExpeditionProgramSerializer()

    class Meta:
        model = models.BatchAgeGroup
        fields = (
            'age_group',
            'ends_at',
            'id',
            'program',
            'starts_at',
        )


class ExpeditionBatchSerializer(HyperlinkedModelSerializer):
    age_groups = BatchAgeGroupSerializer(many=True)
    leisure_centre = HyperlinkedIdentityField(
        view_name='leisure_centres-detail'
    )

    class Meta:
        model = models.ExpeditionBatch
        fields = (
            'age_groups',
            'ends_at',
            'expedition',
            'id',
            'leisure_centre',
            'starts_at',
        )


class LeisureCentreCollection(ReadOnlyModelViewSet):
    queryset = models.LeisureCentre.objects.all()
    serializer_class = LeisureCentreSerializer


class ExpeditionCollection(ReadOnlyModelViewSet):
    queryset = models.Expedition.objects.all()
    serializer_class = ExpeditionSerializer


class ExpeditionBatchCollection(ReadOnlyModelViewSet):
    queryset = models.ExpeditionBatch.objects.all()
    serializer_class = ExpeditionBatchSerializer