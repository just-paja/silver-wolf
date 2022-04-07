from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class ParticipantCollection(ModelViewSet):
    def get_queryset(self):
        return models.Participant.objects.filter(
            Q(family__members__user=self.request.user)
            | Q(family__owner=self.request.user),
        )

    serializer_class = serializers.ParticipantSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
