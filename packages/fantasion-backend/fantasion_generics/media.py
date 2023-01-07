from django.utils.translation import gettext_lazy as _
from django.db.models import (
    CASCADE,
    ForeignKey,
    Model,
    PositiveBigIntegerField,
)


class MediaModelMixin(Model):

    class Meta:
        abstract = True

    height = PositiveBigIntegerField(
        blank=True,
        null=True,
        verbose_name=_('Height'),
    )
    width = PositiveBigIntegerField(
        blank=True,
        null=True,
        verbose_name=_('Width'),
    )


class MediaParentField(ForeignKey):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('on_delete', CASCADE)
        kwargs.setdefault('related_name', 'media')
        kwargs.setdefault('verbose_name', _('Parent object'))
        super().__init__(*args, **kwargs)
