from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from . import models


class CountrySerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Country
        fields = ['id', 'name']


class LocationSerializer(HyperlinkedModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = models.Location
        fields = [
            'id',
            'name',
            'country',
            'city',
            'street',
            'street_number',
            'postal_code',
            'lat',
            'lng',
        ]


class CountryCollection(ModelViewSet):
    queryset = models.Country.objects.all()
    serializer_class = CountrySerializer


class LocationCollection(ReadOnlyModelViewSet):
    queryset = models.Location.objects.all()
    serializer_class = LocationSerializer
