from django.utils import timezone
from rest_framework.serializers import (
    HyperlinkedModelSerializer,
    SerializerMethodField,
)

from . import models


class PriceLevelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.PriceLevel
        fields = (
            "id",
            "title",
        )


class ProductPriceSerializer(HyperlinkedModelSerializer):
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
