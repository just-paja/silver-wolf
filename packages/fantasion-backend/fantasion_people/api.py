from rest_framework.viewsets import ReadOnlyModelViewSet

from . import models
from . import serializers


class ProfileCollection(ReadOnlyModelViewSet):
    queryset = models.Profile.objects.filter(public=True)
    serializer_class = serializers.ProfileSerializer


class Searchable:

    def get_queryset(self):
        queryset = self.model.objects.all()
        query_filter = self.request.query_params.get('q')
        if query_filter:
            queryset = queryset.filter(title__icontains=query_filter)
        return queryset


class AllergyCollection(Searchable, ReadOnlyModelViewSet):
    model = models.Allergy
    serializer_class = serializers.AllergySerializer


class DietCollection(Searchable, ReadOnlyModelViewSet):
    model = models.Diet
    serializer_class = serializers.DietSerializer


class HobbyCollection(Searchable, ReadOnlyModelViewSet):
    model = models.Hobby
    serializer_class = serializers.HobbySerializer
