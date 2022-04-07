from rest_framework.serializers import ModelSerializer

from . import models


class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = models.Participant
        fields = (
            'id',
            'family',
            'first_name',
            'last_name',
            'birthdate',
        )
        read_only_fields = ('family',)

    def create(self, validated_data):
        inst = models.Participant(
            **validated_data,
            family=self.context.get('request').user.families.first(),
        )
        inst.save()
        return inst

    def update(self, instance, data):
        instance.birthday = data.get('birthday', instance.birthday)
        instance.first_name = data.get('first_name', instance.first_name)
        instance.last_name = data.get('last_name', instance.last_name)
        instance.save()
        return instance
