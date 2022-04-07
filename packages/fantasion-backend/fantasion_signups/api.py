from django.db.models import Q

from fantasion_generics.api import RWViewSet
from rest_framework.permissions import IsAuthenticated

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
