from django.conf import settings
from django.db.models import Model, signals
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from versatileimagefield.fields import VersatileImageField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer

from .upload_path import get_upload_path
from .storages import private_storage


class LocalPhotoModel(Model):
    class Meta:
        abstract = True

    local_photo = VersatileImageField(
        blank=True,
        height_field='height',
        max_length=255,
        null=True,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='width',
    )


class PrivatePhotoModel(Model):
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


warm = (LocalPhotoModel, PrivatePhotoModel)


def warm_model(model, inst):
    keyset = settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS
    for field in model._meta.fields:
        if isinstance(field, VersatileImageField):
            for rendition_set in keyset:
                warm_attr(inst, field.name, rendition_set)


def warm_attr(inst, attr, rendition_set):
    warmer = VersatileImageFieldWarmer(
        instance_or_queryset=inst,
        rendition_key_set=rendition_set,
        image_attr=attr
    )
    warmer.warm()


@receiver(signals.post_save)
def warm_images(sender, instance, **kwargs):
    for model in warm:
        if issubclass(sender, model):
            warm_model(model, instance)
