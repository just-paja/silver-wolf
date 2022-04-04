from rest_framework.serializers import HyperlinkedModelSerializer

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

    class Meta:
        model = models.ProductPrice
        fields = (
            "id",
            "available_since",
            "available_until",
            "price",
            "price_level",
        )
