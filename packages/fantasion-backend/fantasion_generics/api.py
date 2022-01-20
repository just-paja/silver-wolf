from django.conf import settings
from rest_framework.serializers import HyperlinkedModelSerializer
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
