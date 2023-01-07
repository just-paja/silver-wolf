from django.db.models import CharField, TextField
from django.utils.translation import gettext_lazy as _


class DescriptionField(TextField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('verbose_name', _('Short Description'))
        kwargs.setdefault(
            'help_text',
            _('Describe this in a couple of sentences. Use Markdown if '
              'necessary, but keeping this a plain text will yield better '
              'results'),
        )
        super().__init__(*args, **kwargs)


class FacultativeDescriptionField(DescriptionField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super().__init__(*args, **kwargs)


class TitleField(CharField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 255)
        kwargs.setdefault('help_text', _('Object name'))
        kwargs.setdefault('verbose_name', _('Title'))
        super().__init__(*args, **kwargs)


class FacultativeTitleField(TitleField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super().__init__(*args, **kwargs)
