from django.db.models import Q

from fantasion_generics.api import RWViewSet
from fantasion_eshop import models as eshop

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import models, serializers


class ParticipantCollection(RWViewSet):
    def get_queryset(self):
        return models.Participant.objects.filter(
            Q(family__members__user=self.request.user)
            | Q(family__owner=self.request.user), )

    serializer_class = serializers.ParticipantSerializer
    permission_classes = [IsAuthenticated]


class SignupCollection(RWViewSet):

    def get_queryset(self):
        return models.Signup.objects.filter(order__owner=self.request.user)

    serializer_class = serializers.SignupSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        inst = self.get_object()
        if inst.order.status == eshop.ORDER_STATUS_NEW:
            inst.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
