from rest_framework.serializers import ModelSerializer

from fantasion_generics.api import (
    LocalPhotoSerializer,
    PublicMediaSerializer,
    media_fields,
)

from . import models


class ProfileMediaSerializer(PublicMediaSerializer):

    class Meta:
        model = models.ProfileMedia
        fields = media_fields


class ProfileSerializer(ModelSerializer):
    avatar = LocalPhotoSerializer()
    media = ProfileMediaSerializer(many=True)

    class Meta:
        model = models.Profile
        fields = (
            'description',
            'id',
            'job_title',
            'avatar',
            'media',
            'text',
            'title',
        )


class AllergySerializer(ModelSerializer):

    class Meta:
        model = models.Allergy
        fields = ('id', 'title', 'description')


class DietSerializer(ModelSerializer):

    class Meta:
        model = models.Diet
        fields = ('id', 'title', 'description')


class HobbySerializer(ModelSerializer):

    class Meta:
        model = models.Hobby
        fields = ('id', 'title', 'description')
