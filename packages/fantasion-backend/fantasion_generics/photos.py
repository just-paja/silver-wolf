from django.db.models import Model, ImageField
from django.utils.translation import ugettext_lazy as _

from .upload_path import get_upload_path


class LocalPhotoModel(Model):
    class Meta:
        abstract = True

    local_photo = ImageField(
        blank=True,
        height_field='height',
        max_length=255,
        null=True,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='width',
    )
