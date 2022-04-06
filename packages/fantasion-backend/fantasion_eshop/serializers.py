from django.utils import timezone
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from fantasion_banking.serializers import PromiseSerializer
from fantasion_signups.models import Signup, Participant
from fantasion_expeditions.models import (
    AgeGroup,
    Expedition,
    ExpeditionBatch,
    Troop,
)

from . import models


class PriceLevelSerializer(ModelSerializer):
    class Meta:
        model = models.PriceLevel
        fields = (
            "id",
            "title",
        )


class ProductPriceSerializer(ModelSerializer):
    price_level = PriceLevelSerializer()
    active = SerializerMethodField()
    expired = SerializerMethodField()
    future = SerializerMethodField()

    def get_active(self, inst):
        return inst.available_until >= timezone.now() >= inst.available_since

    def get_expired(self, inst):
        return inst.available_until < timezone.now()

    def get_future(self, inst):
        return timezone.now() < inst.available_since

    class Meta:
        model = models.ProductPrice
        fields = (
            "id",
            "active",
            "available_since",
            "available_until",
            "expired",
            "future",
            "price",
            "price_level",
        )


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = (
            'id',
            'product_type',
            'price',
        )


class OrderPromotionCodeSerializer(ModelSerializer):
    class Meta:
        model = models.OrderPromotionCode
        fields = OrderItemSerializer.Meta.fields


class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = Participant
        fields = (
            'id',
            'first_name',
            'last_name',
        )


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
        )


class SignupSerializer(ModelSerializer):
    participant = ParticipantSerializer()
    troop = TroopSerializer()

    class Meta:
        model = Signup
        fields = OrderItemSerializer.Meta.fields + (
            'participant',
            'troop',
            'status',
        )


def get_order_item_serializer(item):
    if item.product_type == 'fantasion_signups.Signup':
        return SignupSerializer
    elif item.product_type == 'fantasion_eshop.OrderPromotionCode':
        return OrderPromotionCodeSerializer
    return OrderItemSerializer


def serialize_order_item(item):
    Serializer = get_order_item_serializer(item)
    serializer = Serializer(item.remarshall())
    return serializer.data


class OrderSerializer(ModelSerializer):
    promise = PromiseSerializer()
    items = SerializerMethodField()

    def get_items(self, inst):
        items = inst.order_items.all()
        value = []
        for item in items:
            value.append(serialize_order_item(item))
        return value

    class Meta:
        model = models.Order
        fields = (
            "id",
            "is_cancellable",
            "items",
            "price",
            "promise",
            "status",
            "deposit",
            "use_deposit_payment",
            "variable_symbol",
        )
