from django.shortcuts import get_object_or_404
from django.urls import path

from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class OrderCollection(ModelViewSet):
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Order.objects.filter(owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def destroy(self, inst):
        if inst.status in models.ORDER_CAN_BE_DELETED:
            inst.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def active(self, *args, **kwargs):
        order = self.get_queryset().filter(
            status=models.ORDER_STATUS_NEW, ).first()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def cancel(self, *args, **kwargs):
        inst = self.get_object()
        inst.cancel()
        serializer = serializers.OrderSerializer(inst)
        return Response(serializer.data)
