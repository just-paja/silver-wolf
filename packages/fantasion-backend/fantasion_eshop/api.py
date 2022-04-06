from django.shortcuts import redirect, get_object_or_404
from django.urls import path

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import models, serializers


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_collection(request, format=None):
    orders = models.Order.objects.filter(owner=request.user).all()
    serializer = serializers.OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def order_entity(request, format=None, order_id=None):
    order = get_object_or_404(models.Order, pk=order_id, owner=request.user)

    if request.method == 'DELETE':
        if order.status in models.ORDER_CAN_BE_DELETED:
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    serializer = serializers.OrderSerializer(order)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def order_cancel(request, format=None, order_id=None):
    order = get_object_or_404(models.Order, pk=order_id, owner=request.user)
    order.cancel()
    serializer = serializers.OrderSerializer(order)
    return Response(serializer.data)


urlpatterns = [
    path('', order_collection),
    path('<int:order_id>', order_entity),
    path('<int:order_id>/cancel', order_cancel),
]
