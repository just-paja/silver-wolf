from django.utils.translation import gettext_lazy as _
from django.db.models import Manager, Model, PositiveIntegerField

VISIBILITY_PUBLIC = 1
VISIBILITY_PRIVATE = 2
VISIBILITY_HIDDEN = 3
VISIBILITY_DETAIL = (VISIBILITY_PUBLIC, VISIBILITY_PRIVATE)
VISIBILITY_CHOICES = (
    (VISIBILITY_PUBLIC, _("🌏 Public")),
    (VISIBILITY_PRIVATE, _("🔒 Private")),
    (VISIBILITY_HIDDEN, _("🚫 Hidden")),
)


class VisibilityField(PositiveIntegerField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("default", VISIBILITY_PUBLIC)
        kwargs.setdefault("verbose_name", _("👁 Visibility"))
        kwargs.setdefault("choices", VISIBILITY_CHOICES)
        kwargs.setdefault(
            "help_text",
            _("Public objects will be visible on the website"),
        )
        super().__init__(*args, **kwargs)


class VisibilityManager(Manager):

    def detail(self):
        return self.filter(visibility=VISIBILITY_PUBLIC)

    def list(self):
        return self.filter(visibility=VISIBILITY_PUBLIC)


class VisibilityModel(Model):

    class Meta:
        abstract = True

    visibility = VisibilityField()
    objects = VisibilityManager
