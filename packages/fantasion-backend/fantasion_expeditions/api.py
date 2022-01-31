from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.serializers import (
    HyperlinkedModelSerializer,
    SerializerMethodField,
)

from fantasion_locations.api import LocationSerializer
from fantasion_generics.api import PublicMediaSerializer, media_fields

from . import models


class LeisureCentreMediaSerializer(PublicMediaSerializer):
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
            'detailed_description',
            'id',
            'location',
            'mailing_address',
            'media',
            'slug',
            'title',
        )


class ExpeditionMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ExpeditionMedia
        fields = media_fields


class AgeGroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.AgeGroup
        fields = (
            'age_max',
            'age_min',
            'id',
            'title',
        )


class ExpeditionProgramMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ExpeditionProgramMedia
        fields = media_fields


class ExpeditionProgramSerializer(HyperlinkedModelSerializer):
    media = ExpeditionProgramMediaSerializer(many=True)

    class Meta:
        model = models.ExpeditionProgram
        fields = (
            'id',
            'title',
            'description',
            'detailed_description',
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
    leisure_centre = LeisureCentreSerializer()

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


class ExpeditionSerializer(HyperlinkedModelSerializer):
    batches = SerializerMethodField('get_batches')
    media = ExpeditionMediaSerializer(many=True)

    class Meta:
        model = models.Expedition
        fields = (
            'id',
            'batches',
            'description',
            'detailed_description',
            'media',
            'slug',
            'title',
        )

    def get_batches(self, obj):
        serializer = ExpeditionBatchSerializer(
            obj.batches.filter(public=True),
            many=True,
            context=self.context,
        )
        return serializer.data


class LeisureCentreCollection(ReadOnlyModelViewSet):
    queryset = models.LeisureCentre.objects.all()
    serializer_class = LeisureCentreSerializer


class ExpeditionCollection(ReadOnlyModelViewSet):
    queryset = models.Expedition.objects.filter(public=True).all()
    serializer_class = ExpeditionSerializer


class ExpeditionBatchCollection(ReadOnlyModelViewSet):
    queryset = models.ExpeditionBatch.objects.filter(public=True).all()
    serializer_class = ExpeditionBatchSerializer
