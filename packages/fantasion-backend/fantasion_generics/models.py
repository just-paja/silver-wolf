from django_extensions.db.models import AutoSlugField, TimeStampedModel
from django.db.models import BooleanField, IntegerField, TextField
from django.utils.translation import ugettext_lazy as _
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
        sub(r"(\s|_|-)+", " ",
            sub(ksub, lambda mo: ' ' + mo.group(0).lower(), s)).split())


class NamedModel(TimeStampedModel):
    class Meta:
        abstract = True

    title = FacultativeTitleField()
    description = FacultativeDescriptionField()


class MediaObjectModel(
        MediaModelMixin,
        LocalPhotoModel,
        LocalVideoModel,
):
    class Meta:
        abstract = True
        verbose_name = _('Media Object')
        verbose_name_plural = _('Media Objects')

    description = FacultativeDescriptionField()

    @property
    def upload_dir(self):
        return '{0}/{1}'.format(
            kebab(self.__class__.parent.field.remote_field.model.__name__),
            self.parent_id)


class PublicModel(NamedModel):
    class Meta:
        abstract = True

    title = TitleField()
    description = DescriptionField()
    slug = AutoSlugField(populate_from=('title', ))

    def __str__(self):
        return self.title


class VisibilityField(BooleanField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('default', True)
        kwargs.setdefault('verbose_name', _('Public'))
        kwargs.setdefault(
            'help_text',
            _('Public objects will be visible on the website'),
        )
        super().__init__(*args, **kwargs)


class ImportanceField(IntegerField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('default', 0)
        kwargs.setdefault('verbose_name', _('Object Importance'))
        kwargs.setdefault(
            'help_text',
            _('More important objects will appear on the top or sooner on '
              'the page'),
        )
        super().__init__(*args, **kwargs)


class DetailedDescriptionField(TextField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('verbose_name', _('Detailed Description'))
        kwargs.setdefault(
            'help_text',
            _('Detailed verbose description formatted in Markdown. There'
              'is no text limit.'),
        )
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super().__init__(*args, **kwargs)
