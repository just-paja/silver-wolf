from django.conf import settings
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from versatileimagefield.serializers import VersatileImageFieldSerializer

from .visibility import VISIBILITY_DETAIL, VISIBILITY_PUBLIC


class LocalPhotoSerializer(VersatileImageFieldSerializer):

    def __init__(self, *args, **kwargs):
        sizes = []
        ren_sets = settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS.items()
        for rendition_set in ren_sets:
            for specs in rendition_set[1]:
                sizes.append((
                    "{}_{}".format(rendition_set[0], specs[0]),
                    specs[1],
                ))
        super().__init__(sizes=sizes, *args, **kwargs)

    def to_native(self, *args, **kwargs):
        return super().to_native(*args, **kwargs) or None


class PublicMediaSerializer(HyperlinkedModelSerializer):
    local_photo = LocalPhotoSerializer()


media_fields = (
    'duration',
    'height',
    'id',
    'local_photo',
    'local_video',
    'width',
)

address_fields = (
    'city',
    'country',
    'id',
    'postal_code',
    'street',
    'street_number',
)


class RWViewSet(ModelViewSet):

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class PublicInfoViewSet(
        ListModelMixin,
        RetrieveModelMixin,
        GenericViewSet,
):

    def get_queryset(self, include_private=False):
        qs = super().get_queryset()
        if include_private:
            return qs.filter(visibility__in=VISIBILITY_DETAIL)
        return qs.filter(visibility=VISIBILITY_PUBLIC)

    def get_object(self, include_private=False):
        queryset = self.filter_queryset(self.get_queryset(include_private))

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg))

        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object(include_private=True)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
