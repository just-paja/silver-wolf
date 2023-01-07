from django.conf import settings
from django.db.models import Model, signals
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from versatileimagefield.fields import VersatileImageField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer

from .upload_path import get_upload_path
from .storages import private_storage


class LocalPhotoField(VersatileImageField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('blank', True)
        kwargs.setdefault('max_length', 255)
        kwargs.setdefault('null', True)
        kwargs.setdefault('upload_to', get_upload_path)
        kwargs.setdefault('verbose_name', _('Image file'))
        super().__init__(*args, **kwargs)


class WarmPhotoModel():
    pass


class LocalPhotoModel(Model, WarmPhotoModel):

    class Meta:
        abstract = True

    local_photo = LocalPhotoField(
        height_field='height',
        width_field='width',
    )


class PrivatePhotoModel(Model, WarmPhotoModel):

    class Meta:
        abstract = True

    private_photo = VersatileImageField(
        blank=True,
        height_field='height',
        max_length=255,
        null=True,
        storage=private_storage,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='width',
    )


def warm_model(model, inst):
    keyset = settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS
    for field in model._meta.fields:
        if isinstance(field, VersatileImageField):
            for rendition_set in keyset:
                warm_attr(inst, field.name, rendition_set)


def warm_attr(inst, attr, rendition_set):
    warmer = VersatileImageFieldWarmer(
        image_attr=attr,
        instance_or_queryset=inst,
        rendition_key_set=rendition_set,
    )
    warmer.warm()


@receiver(signals.post_save)
def warm_images(sender, instance, **kwargs):
    if issubclass(sender, WarmPhotoModel):
        warm_model(instance.__class__, instance)
