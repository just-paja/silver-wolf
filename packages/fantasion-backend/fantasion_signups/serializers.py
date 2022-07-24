from django.core.exceptions import PermissionDenied
from rest_framework.serializers import CharField, ModelSerializer, IntegerField, SerializerMethodField

from . import models
from fantasion_people import models as people
from fantasion_eshop import models as eshop
from fantasion_expeditions.models import (
    AgeGroup,
    Expedition,
    ExpeditionBatch,
    Troop,
)

TRAIT_FIELDS = ('id', 'title', 'description')


class TraitSerializer(ModelSerializer):
    title = CharField()

    def create(self, data):
        inst, created = self.Meta.model.objects.get_or_create(**data)
        return inst


class AllergySerializer(TraitSerializer):

    class Meta:
        model = people.Allergy
        fields = TRAIT_FIELDS


class DietSerializer(TraitSerializer):

    class Meta:
        model = people.Diet
        fields = TRAIT_FIELDS


class HobbySerializer(TraitSerializer):

    class Meta:
        model = people.Hobby
        fields = TRAIT_FIELDS


class ParticipantTraitSerializer:
    trait = None

    def __init__(self, *args, participant=None, **kwargs):
        self.participant = participant
        super().__init__(*args, **kwargs)

    def create(self, data):
        if self.trait in data:
            field = self.fields.get(self.trait)
            seri = field.__class__(data=data.get(self.trait))
            if seri.is_valid():
                trait = seri.save()

        if self.participant:
            data = {"participant": self.participant, self.trait: trait}
        inst, created = self.__class__.Meta.model.objects.get_or_create(**data)
        return inst


class ParticipantAllergySerializer(
        ParticipantTraitSerializer,
        ModelSerializer,
):
    allergy = AllergySerializer()
    trait = 'allergy'

    class Meta:
        model = models.ParticipantAllergy
        fields = (
            'id',
            'allergy',
        )


class ParticipantDietSerializer(ParticipantTraitSerializer, ModelSerializer):
    diet = DietSerializer()
    trait = 'diet'

    class Meta:
        model = models.ParticipantDiet
        fields = (
            'id',
            'diet',
        )


class ParticipantHobbySerializer(ParticipantTraitSerializer, ModelSerializer):
    hobby = HobbySerializer()
    trait = 'hobby'

    class Meta:
        model = models.ParticipantHobby
        fields = (
            'id',
            'hobby',
        )


class ParticipantSerializer(ModelSerializer):
    allergies = ParticipantAllergySerializer(
        many=True,
        required=False,
        source='participant_allergies',
    )
    diets = ParticipantDietSerializer(
        many=True,
        required=False,
        source='participant_diets',
    )
    hobbies = ParticipantHobbySerializer(
        many=True,
        required=False,
        source='participant_hobbies',
    )
    can_delete = SerializerMethodField()

    class Meta:
        model = models.Participant
        fields = (
            'allergies',
            'birthdate',
            'can_delete',
            'diets',
            'family',
            'first_name',
            'hobbies',
            'id',
            'last_name',
            'no_allergies',
            'no_diets',
            'no_hobbies',
        )
        read_only_fields = ('family', )

    def get_or_create_family(self):
        user = self.context.get('request').user
        family = user.families.first()
        if not family:
            family = people.Family(
                owner=user,
                title=f"{user.get_full_name()} Family",
            )
            family.save()
        return family

    def get_can_delete(self, obj):
        return obj.signups.count() == 0

    def create(self, validated_data):
        inst = models.Participant(
            **validated_data,
            family=self.get_or_create_family(),
        )
        inst.save()
        return inst

    def store_trait(self, inst, serializer, data):
        seri = serializer(data=data, participant=inst, many=True)
        if seri.is_valid():
            stored = seri.save()
            ids = [item.pk for item in stored]
            serializer.Meta.model.objects.filter(participant=inst).exclude(
                id__in=ids).delete()
            return stored

    def update(self, inst, data):
        allergies = data.pop('participant_allergies', None)
        diets = data.pop('participant_diets', None)
        hobbies = data.pop('participant_hobbies', None)
        inst = super().update(inst, data)
        if allergies is not None:
            self.store_trait(inst, ParticipantAllergySerializer, allergies)
        if diets is not None:
            self.store_trait(inst, ParticipantDietSerializer, diets)
        if hobbies is not None:
            self.store_trait(inst, ParticipantHobbySerializer, hobbies)
        return inst


class AgeGroupSerializer(ModelSerializer):

    class Meta:
        model = AgeGroup
        fields = (
            "age_max",
            "age_min",
            "id",
            "title",
        )


class ExpeditionSerializer(ModelSerializer):

    class Meta:
        model = Expedition
        fields = (
            "id",
            "title",
        )


class BatchSerializer(ModelSerializer):
    expedition = ExpeditionSerializer()

    class Meta:
        model = ExpeditionBatch
        fields = (
            "id",
            "expedition",
        )


class TroopSerializer(ModelSerializer):
    age_group = AgeGroupSerializer()
    batch = BatchSerializer()

    class Meta:
        model = Troop
        fields = (
            "age_group",
            "ends_at",
            "id",
            "batch",
            "program",
            "starts_at",
            "price_includes",
        )


class SignupSerializer(ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    participant_id = IntegerField()
    order_id = IntegerField(required=False)
    troop_id = IntegerField()
    troop = TroopSerializer(read_only=True)

    class Meta:
        model = models.Signup
        fields = (
            'id',
            'legal_guardian',
            'note',
            'participant',
            'participant_id',
            'price',
            'product_type',
            'order_id',
            'status',
            'troop',
            'troop_id',
        )
        read_only_fields = (
            'id',
            'product_type',
            'price',
            'status',
            'participant',
            'troop',
        )

    def get_or_create_order(self, order_id):
        user = self.context.get('request').user
        order = None
        if order_id:
            order = eshop.Order.objects.filter(
                owner=user,
                pk=order_id,
                status=eshop.ORDER_STATUS_NEW,
            ).first()
        else:
            order = eshop.Order.objects.filter(
                owner=user, status=eshop.ORDER_STATUS_NEW).first()

        if not order:
            order = eshop.Order(
                owner=user,
                user_invoice_address=user.get_default_invoice_address(),
            )
            order.save()
        return order

    def create(self, data):
        order = self.get_or_create_order(data.get('order_id', None))
        participant = models.Participant.objects.get(
            pk=data.get('participant_id'), )
        troop = Troop.objects.get(pk=data.get('troop_id'))
        try:
            inst = models.Signup(
                family=participant.family,
                legal_guardian=data.get('legal_guardian'),
                note=data.get('note'),
                order=order,
                participant=participant,
                product_price=troop.get_active_price(),
                troop=troop,
            )
            inst.save()
        except eshop.ProductPrice.DoesNotExist:
            raise PermissionDenied

        return inst
