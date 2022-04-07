from rest_framework.serializers import ModelSerializer

from fantasion_people.models import Family
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


    def get_or_create_family(self):
        user = self.context.get('request').user
        family = user.families.first()
        if not family:
            family = Family(owner=user, title=f"{user.get_full_name()} Family")
            family.save()
        return family


    def create(self, validated_data):
        inst = models.Participant(
            **validated_data,
            family=self.get_or_create_family(),
        )
        inst.save()
        return inst

    def update(self, instance, data):
        instance.birthday = data.get('birthday', instance.birthday)
        instance.first_name = data.get('first_name', instance.first_name)
        instance.last_name = data.get('last_name', instance.last_name)
        instance.save()
        return instance
