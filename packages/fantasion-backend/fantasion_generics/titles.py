from django.db.models import CharField, TextField
from django.utils.translation import ugettext_lazy as _


class DescriptionField(TextField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('help_text', _('Object description'))
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
        super().__init__(*args, **kwargs)


class FacultativeTitleField(TitleField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super().__init__(*args, **kwargs)
