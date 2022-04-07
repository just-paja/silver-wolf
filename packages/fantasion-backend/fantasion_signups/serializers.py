from rest_framework.serializers import ModelSerializer

from . import models


class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = models.Participant
        fields = (
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
        )
