from django_extensions.db.models import AutoSlugField, TimeStampedModel

from .photos import LocalPhotoModel
from .videos import LocalVideoModel
from .titles import (
    DescriptionField,
    FacultativeDescriptionField, 
    FacultativeTitleField,
    TitleField,
)

class NamedModel(TimeStampedModel):
    class Meta:
        abstract = True

    title = FacultativeTitleField()
    description = FacultativeDescriptionField()



class MediaObjectModel(NamedModel, LocalPhotoModel, LocalVideoModel):
    class Meta:
        abstract = True


class PublicModel(NamedModel):
    class Meta:
        abstract = True

    slug = AutoSlugField(populate_from=('title',))

