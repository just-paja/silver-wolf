import czech_sort

from djangomni_search.admin import OmniSearchAdminSite
from django.conf import settings
from django.contrib.admin import AdminSite
from django.db import models
from django.forms import Textarea
from nested_admin import NestedModelAdmin, NestedStackedInline
from modeltranslation.admin import (
    TranslationStackedInline,
    TabbedDjangoJqueryTranslationAdmin,
)


def is_admin_model(cls):
    return (isinstance(cls, type) and issubclass(cls, BaseAdmin)
            and cls != BaseAdmin and cls != TranslatedAdmin)


def get_module_admin_models(module):
    return [
        cls for name, cls in module.__dict__.items() if is_admin_model(cls)
    ]


class BaseAdmin(NestedModelAdmin):

    class Media:
        css = {'all': ('css/fantasion-admin.css', )}


class TranslatedAdmin(BaseAdmin, TabbedDjangoJqueryTranslationAdmin):
    pass


class BaseAdminSite(OmniSearchAdminSite, AdminSite):
    site_header = "Fantasion"
    name = 'admin'
    site_url = settings.APP_WEBSITE_URL

    def __init__(self):
        super().__init__(self.name)
        # if settings.DJANGO_ADMIN_SSO:
        #     self.login = gauth

    def get_model_sort_helper(self, request):
        return lambda x: czech_sort.key(x['name'][0])

    def hookup(self, admin_model):
        return self.register(admin_model.model, admin_model)

    def hookup_all(self, admin_models):
        for admin_model in admin_models:
            self.hookup(admin_model)

    def hookup_module(self, module):
        self.hookup_all(get_module_admin_models(module))


class MediaAdmin(NestedStackedInline, TranslationStackedInline):
    extra = 0
    fields = ('local_photo', 'local_video', 'description')

    formfield_overrides = {
        models.TextField: {
            'widget': Textarea(attrs={
                'rows': 1,
            })
        },
    }
