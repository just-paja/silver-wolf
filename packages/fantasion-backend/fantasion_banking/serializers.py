from rest_framework.serializers import HyperlinkedModelSerializer

from . import models


class AccountSerializer(HyperlinkedModelSerializer):

    class Meta:
        model = models.Account
        fields = ("id", "driver")


class DebtSerializer(HyperlinkedModelSerializer):

    class Meta:
        model = models.Debt
        fields = (
            "amount",
            "debt_type",
            "id",
            "maturity",
        )


class PromiseSerializer(HyperlinkedModelSerializer):
    debts = DebtSerializer(many=True)

    class Meta:
        model = models.Promise
        fields = (
            "debts",
            "id",
            "status",
            "title",
        )
