from django.contrib.auth import admin as auth_admin
from django.utils.translation import ugettext_lazy as _

from fantasion_generics.admin import BaseAdmin

from . import models

fieldset_security = (
    _('Security information'),
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


class UserAdmin(BaseAdmin, auth_admin.UserAdmin):
    model = models.User
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


class EmailVerificationAdmin(BaseAdmin):
    model = models.EmailVerification
    list_display = (
        'email',
        'user',
        'expires_on',
        'next_step',
        'sent',
        'used',
    )
    list_filter = (
        'used',
        'expires_on',
    )
