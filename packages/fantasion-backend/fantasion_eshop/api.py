import json

from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework import renderers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from fantasion_generics.api import RWViewSet
from djangorestframework_camel_case.render import CamelCaseJSONRenderer

from . import models, serializers


class OrderCollection(RWViewSet):
    renderer_classes = [CamelCaseJSONRenderer, renderers.TemplateHTMLRenderer]
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = models.Order.objects
        if not self.request.user.has_perm('fantasion_eshop.can_view_order'):
            query = query.filter(owner=self.request.user)
        return query

    def list(self, request):
        queryset = self.get_queryset().exclude(status=models.ORDER_STATUS_NEW)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, inst):
        if inst.status in models.ORDER_CAN_BE_DELETED:
            inst.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def active(self, *args, **kwargs):
        order = self.get_queryset().filter(
            status=models.ORDER_STATUS_NEW, ).first()
        if order:
            return Response(self.get_serializer(order).data)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put'])
    def confirm(self, *args, **kwargs):
        order = self.get_object()
        if order.status == models.ORDER_STATUS_NEW:
            order.confirm()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['get'])
    def invoice(self, *args, **kwargs):
        inst = self.get_object()
        try:
            serializer = serializers.InvoiceSerializer(inst)
            return Response(
                serializer.data,
                template_name='eshop/invoice.html',
            )
        except ObjectDoesNotExist:
            raise Http404()

    @action(detail=True, methods=['post'], url_path=r'promotion-codes')
    def promotion_codes(self, *args, **kwargs):
        order = self.get_object()
        try:
            body = json.loads(self.request.body)
            code = models.PromotionCode.objects.filter(code=body.get(
                'code', None), ).get()
            existing = models.OrderPromotionCode.objects.filter(
                order=order,
                promotion_code=code,
            ).first()
            if existing:
                message = _(
                    "Cannot use the same Promotion Code multiple times")
                return Response(
                    {"code": [message]},
                    status=status.HTTP_403_FORBIDDEN,
                )
            item = models.OrderPromotionCode(
                order=order,
                promotion_code=code,
            )
            item.save()
            return Response(
                self.get_serializer(order).data,
                status=status.HTTP_201_CREATED,
            )
        except models.PromotionCode.DoesNotExist:
            return Response(
                {
                    "code": [_("Invalid Promotion Code")],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=['put'])
    def cancel(self, *args, **kwargs):
        inst = self.get_object()
        inst.cancel()
        serializer = serializers.OrderSerializer(inst)
        return Response(serializer.data)


class OrderItemCollection(RWViewSet):
    serializer_class = serializers.OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = models.OrderItem.objects
        if not self.request.user.has_perm('fantasion_eshop.can_view_order'):
            query = query.filter(order__owner=self.request.user)
        return query

    def destroy(self, *args, **kwargs):
        item = self.get_object()
        order = item.order
        if order.can_be_modified():
            item.delete()
            order.refresh_from_db()
            return Response(serializers.OrderSerializer(order).data)
        return Response(status=status.HTTP_403_FORBIDDEN)
