from django.conf import settings
from django.contrib.auth import admin as auth_admin
from django.utils.translation import ugettext_lazy as _

from admin_sso.admin import AssignmentAdmin
from admin_sso.models import Assignment

from fantasion_banking import admin as banking
from fantasion_content import admin as content
from fantasion_domain.views import gauth
from fantasion_eshop import admin as eshop
from fantasion_expeditions import admin as expeditions
from fantasion_generics.admin import BaseAdminSite
from fantasion_locations import admin as locations
from fantasion_people import admin as people
from fantasion_signups import admin as signups

from . import admin_models as base


class ContentAdminSite(BaseAdminSite):
    name = "base"
    site_title = _("Base")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.hookup_module(banking)
        self.hookup_module(base)
        self.hookup_module(content)
        self.hookup_module(eshop)
        self.hookup_module(expeditions)
        self.hookup_module(locations)
        self.hookup_module(people)
        self.hookup_module(signups)
        self.register(Assignment, AssignmentAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)

        if settings.DJANGO_ADMIN_SSO:
            self.login = gauth


CONTENT_ADMIN = ContentAdminSite()
