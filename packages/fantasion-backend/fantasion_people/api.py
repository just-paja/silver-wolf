from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_generics.api import PublicMediaSerializer, media_fields

from . import models


class ProfileMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ProfileMedia
        fields = media_fields


class ProfileSerializer(HyperlinkedModelSerializer):
    media = ProfileMediaSerializer(many=True)

    class Meta:
        model = models.Profile
        fields = ['id', 'title', 'description', 'text', 'media']


class ProfileCollection(ReadOnlyModelViewSet):
    queryset = models.Profile.objects.filter(public=True)
    serializer_class = ProfileSerializer
