from django_extensions.db.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from django.db.models import CharField, TextField


class ShortPromotionText(TimeStampedModel):
    class Meta:
        verbose_name = _('Short Promotion Text')
        verbose_name_plural = _('Short Promotion Texts')

    text = TextField(
        verbose_name=_('Short Promotion Text'),
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
