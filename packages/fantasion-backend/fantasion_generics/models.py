from django_extensions.db.models import AutoSlugField, TimeStampedModel
from re import sub

from .media import MediaModelMixin
from .photos import LocalPhotoModel
from .videos import LocalVideoModel
from .titles import (
    DescriptionField,
    FacultativeDescriptionField,
    FacultativeTitleField,
    TitleField,
)


ksub = r"[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+"


def kebab(s):
    return '-'.join(
        sub(
            r"(\s|_|-)+",
            " ",
            sub(ksub, lambda mo: ' ' + mo.group(0).lower(), s)
        ).split()
    )


class NamedModel(TimeStampedModel):
    class Meta:
        abstract = True

    title = FacultativeTitleField()
    description = FacultativeDescriptionField()


class MediaObjectModel(
    NamedModel,
    MediaModelMixin,
    LocalPhotoModel,
    LocalVideoModel
):
    class Meta:
        abstract = True

    @property
    def upload_dir(self):
        return '{0}/{1}'.format(
            kebab(self.__class__.parent.field.remote_field.model.__name__),
            self.parent_id
        )


class PublicModel(NamedModel):
    class Meta:
        abstract = True

    title = TitleField()
    description = DescriptionField()
    slug = AutoSlugField(populate_from=('title',))

    def __str__(self):
        return self.title
