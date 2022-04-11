from django.conf import settings
from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ModelViewSet
from versatileimagefield.serializers import VersatileImageFieldSerializer


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
