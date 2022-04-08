import json

from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework import renderers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer

from . import models, serializers


class OrderCollection(ModelViewSet):
    renderer_classes = [CamelCaseJSONRenderer, renderers.TemplateHTMLRenderer]
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = models.Order.objects
        if not self.request.user.has_perm('fantasion_eshop.can_view_order'):
            query = query.filter(owner=self.request.user)
        return query

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
            code = models.PromotionCode.objects.filter(
                code=body.get('code', None),
            ).get()
            existing = models.OrderPromotionCode.objects.filter(
                order=order,
                promotion_code=code,
            ).first()
            if existing:
                return Response(
                    {"code": [
                        _("Cannot use the same Promotion Code multiple times")
                    ]},
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
            return Response({
                "code": [_("Invalid Promotion Code")],
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def cancel(self, *args, **kwargs):
        inst = self.get_object()
        inst.cancel()
        serializer = serializers.OrderSerializer(inst)
        return Response(serializer.data)
