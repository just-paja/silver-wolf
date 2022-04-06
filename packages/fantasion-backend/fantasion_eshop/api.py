from django.urls import path

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


urlpatterns = [
    path('', order_collection),
]
