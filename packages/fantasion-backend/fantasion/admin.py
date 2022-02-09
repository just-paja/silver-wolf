from django.contrib.auth import admin as auth_admin
from django.utils.translation import ugettext_lazy as _

from fantasion_content import admin as content
from fantasion_generics.admin import BaseAdminSite
from fantasion_eshop import admin as eshop
from fantasion_expeditions import admin as expeditions
from fantasion_locations import admin as locations
from fantasion_people import admin as people
from fantasion_signups import admin as signups

from . import models as base

fieldset_security = (
    _('Security'),
    {
        'fields': ('password', 'last_login', 'date_joined')
    },
)
fieldset_personal = (
    _('Personal information'),
    {
        'fields':
        ('first_name', 'last_name', 'email', 'email_verified', 'phone'),
    },
)
fieldset_permissions = (
    _('Permissions'),
    {
        'fields':
        ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
    },
)


class UserAdmin(auth_admin.UserAdmin):
    ordering = ('last_name', )
    fieldsets = (
        fieldset_personal,
        fieldset_permissions,
        fieldset_security,
    )
    list_display = (
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'is_superuser',
        'last_login',
    )


class ContentAdminSite(BaseAdminSite):
    name = "base"
    site_title = _("Base")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.hookup_module(content)
        self.hookup_module(eshop)
        self.hookup_module(expeditions)
        self.hookup_module(locations)
        self.hookup_module(people)
        self.hookup_module(signups)
        self.register(base.User, UserAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)


CONTENT_ADMIN = ContentAdminSite()
