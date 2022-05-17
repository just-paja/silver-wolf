from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    ReadOnlyField,
    IntegerField,
)

from fantasion.models import UserAddress
from fantasion_banking.serializers import PromiseSerializer
from fantasion_generics.api import address_fields
from fantasion_signups.models import Signup, Participant
from fantasion_expeditions.models import (
    AgeGroup,
    Expedition,
    ExpeditionBatch,
    Troop,
)

from . import models


class UserAddressSerializer(ModelSerializer):

    class Meta:
        model = UserAddress
        fields = address_fields


class OrderInvoiceAddressSerializer(ModelSerializer):

    class Meta:
        model = models.OrderInvoiceAddress
        fields = address_fields


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
        return not (self.get_expired(inst) or self.get_future(inst))

    def get_expired(self, inst):
        return inst.available_until and inst.available_until < timezone.now()

    def get_future(self, inst):
        return inst.available_since and timezone.now() < inst.available_since

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
            "batch",
            "ends_at",
            "id",
            "price_includes",
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
    invoice_address = OrderInvoiceAddressSerializer()
    user_invoice_address = UserAddressSerializer()
    invoice_address_id = IntegerField(allow_null=True)
    user_invoice_address_id = IntegerField(allow_null=True)

    def get_items(self, inst):
        items = inst.order_items.all()
        value = []
        for item in items:
            value.append(serialize_order_item(item))
        return value

    class Meta:
        model = models.Order
        fields = (
            "deposit",
            "id",
            "invoice_address",
            "invoice_address_id",
            "is_cancellable",
            "items",
            "price",
            "promise",
            "request_insurance",
            "status",
            "submitted_at",
            "use_deposit_payment",
            "user_invoice_address",
            "user_invoice_address_id",
            "variable_symbol",
        )
        read_only_fields = (
            'deposit',
            'invoice_address',
            'is_cancellable',
            'items',
            'items',
            'price',
            'promise',
            'status',
            'submitted_at',
            'variable_symbol',
        )


class OrderOwnerSerializer(ModelSerializer):
    full_name = SerializerMethodField()

    def get_full_name(self, inst):
        return inst.get_full_name()

    class Meta:
        model = get_user_model()
        fields = (
            'full_name',
            'email',
        )


class InvoiceSerializer(ModelSerializer):
    debts = SerializerMethodField()
    due_date = SerializerMethodField()
    items = SerializerMethodField()
    owner = OrderOwnerSerializer()
    invoice_address = UserAddressSerializer()
    partial_debts = SerializerMethodField()
    total = SerializerMethodField()
    bank_account = ReadOnlyField(default=settings.BANK_ACCOUNT_NUMBER)

    def get_debts(self, inst):
        promise = inst.promise
        if not promise:
            return []
        return inst.promise.debts.all()

    def get_partial_debts(self, inst):
        promise = inst.promise
        if not promise:
            return []
        return inst.promise.debts.exclude(
            debt_type=models.DEBT_TYPE_FULL_PAYMENT, ).all()

    def get_due_date(self, inst):
        if not inst.promise:
            return None
        query = inst.promise.debts
        debt = query.first()
        return debt.maturity

    def get_items(self, inst):
        return inst.order_items.all()

    def get_total(self, inst):
        return inst.price

    class Meta:
        model = models.Order
        fields = (
            'bank_account',
            'partial_debts',
            'debts',
            'owner',
            'due_date',
            'invoice_address',
            'variable_symbol',
            'deposit',
            'items',
            'total',
        )
