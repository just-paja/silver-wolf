from django.shortcuts import get_object_or_404
from django.urls import path

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import models, serializers


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def participant_collection(request, format=None):
    participants = models.Participant.objects.filter(
        family__members__user=request.user,
    ).all()
    serializer = serializers.ParticipantSerializer(participants, many=True)
    return Response(serializer.data)


def with_participant(fn):
    def inner(request, participant_id=None, *args, **kwargs):
        participant = get_object_or_404(
            models.Participant,
            pk=kwargs.get('id'),
            family__members__user=request.user,
        )
        return fn(request, participant=participant, *args, **kwargs)
    return inner


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@with_participant
def participant_entity(request, participant=None, **kwargs):
    serializer = serializers.ParticipantSerializer(participant)
    return Response(serializer.data)


participants = [
    path('', participant_collection),
    path('<int:id>', participant_entity),
]
