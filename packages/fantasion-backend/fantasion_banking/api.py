from fantasion_generics.api import RWViewSet

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)

from . import models, serializers


class AccountCollection(RWViewSet):

    queryset = models.Account.objects.filter(driver__isnull=False)

    serializer_class = serializers.AccountSerializer
    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [DjangoModelPermissions]

    @action(detail=False, methods=['put'])
    def sync(self, *args, **kwargs):
        accounts = models.Account.objects.filter(driver__isnull=False).all()
        for account in accounts:
            account.sync()
        return Response(status=status.HTTP_204_NO_CONTENT)
