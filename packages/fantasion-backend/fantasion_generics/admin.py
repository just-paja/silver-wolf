import czech_sort

from django.conf import settings
from django.contrib.admin import AdminSite
from django.http import Http404
from modeltranslation.admin import TranslationStackedInline
from nested_admin import NestedModelAdmin, NestedStackedInline


def is_admin_model(cls):
    return (
        isinstance(cls, type) and
        issubclass(cls, BaseAdmin) and
        cls != BaseAdmin
    )


def get_module_admin_models(module):
    return [
        cls for name, cls in module.__dict__.items() if is_admin_model(cls)
    ]


class BaseAdmin(NestedModelAdmin):
    pass


class BaseAdminSite(AdminSite):
    site_header = "Fantasion"
    name = 'admin'
    site_url = settings.APP_WEBSITE_URL

    def __init__(self):
        super().__init__(self.name)
        # if settings.DJANGO_ADMIN_SSO:
        #     self.login = gauth

    def get_model_sort_helper(self, request):
        return lambda x: czech_sort.key(x['name'][0])

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        sort_helper = self.get_model_sort_helper(request)
        for app in app_list:
            app['models'].sort(key=sort_helper)
        app_list.sort(key=sort_helper)
        return app_list

    def app_index(self, request, app_label, extra_context=None):
        app_dict = self._build_app_dict(request, app_label)
        if not app_dict:
            raise Http404('The requested admin page does not exist.')
        app_dict['models'].sort(key=self.get_model_sort_helper(request))
        app_list = [app_dict]
        return super().app_index(request, app_label, {
            **(extra_context or {}),
            'app_list': app_list
        })

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
