from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from django.db.models import CharField, TextField

from fantasion_generics.media import MediaParentField

from fantasion_generics.models import (
    MediaObjectModel,
    PublicModel,
    VisibilityField,
)


class FlavourText(TimeStampedModel):
    class Meta:
        verbose_name = _('Flavour Text')
        verbose_name_plural = _('Flavour Texts')

    text = TextField(
        verbose_name=_('Flavour Text'),
        help_text=_(
            'Write down a short quote displayed on the web for fun and to'
            'promote the atmosphere on the summer camp'),
    )
    quote_owner = CharField(
        max_length=63,
        verbose_name=_('Quote Owner'),
        help_text=_(
            'A name that will be displayed as the original author of the quote'
        ),
    )


class StaticArticle(PublicModel):
    class Meta:
        verbose_name = _('Static Articles')
        verbose_name_plural = _('Static Articles')

    key = CharField(
        max_length=32,
        unique=True,
        verbose_name=_('Article key'),
        help_text=_(
            'Unique key used to reference the article directly on the API'),
    )
    text = TextField(
        verbose_name=_('Article text'),
        help_text=_('Your article content formatted in Markdown'),
    )
    public = VisibilityField()


class StaticArticleMedia(MediaObjectModel):
    parent = MediaParentField(StaticArticle)
