from django_extensions.db.models import TimeStampedModel

from .photos import LocalPhotoModel
from .titles import FacultativeDescriptionField, FacultativeTitleField
from .videos import LocalVideoModel


class MediaObject(LocalPhotoModel, LocalVideoModel, TimeStampedModel):
    class Meta:
        abstract = True

    title = FacultativeTitleField()
    description = FacultativeDescriptionField()


