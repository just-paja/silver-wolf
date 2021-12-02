from django.contrib.auth import admin as auth_admin
from django.utils.translation import ugettext_lazy as _

from fantasion_generics.admin import BaseAdminSite
from fantasion_expeditions import admin as expeditions
from fantasion_locations import admin as locations


class ContentAdminSite(BaseAdminSite):
    name = 'base'
    site_title = _('Base')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.hookup_module(expeditions)
        self.hookup_module(locations)
        self.register(auth_admin.User, auth_admin.UserAdmin)


CONTENT_ADMIN = ContentAdminSite()
