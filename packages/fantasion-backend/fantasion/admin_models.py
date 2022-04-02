from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import password_validation
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
        (
            'first_name',
            'last_name',
            'email',
            'email_verified',
            'phone',
            'password_created',
        ),
    },
)
fieldset_permissions = (
    _('Permissions'),
    {
        'fields':
        ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
    },
)


class FantasionUserCreationForm(UserCreationForm):
    password1 = forms.CharField(
        label=_("Password"),
        strip=False,
        required=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        label=_("Password confirmation"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        required=False,
        help_text=_("Enter the same password as before, for verification."),
    )


class UserAdmin(BaseAdmin, auth_admin.UserAdmin):
    model = models.User
    ordering = ('last_name', )
    add_form = FantasionUserCreationForm
    search_fields = ('first_name', 'last_name', 'email')
    fieldsets = (
        fieldset_personal,
        fieldset_permissions,
        fieldset_security,
    )
    add_fieldsets = ((None, {
        'classes': ('wide', ),
        'fields': (
            'first_name',
            'last_name',
            'email',
            'phone',
            'password1',
            'password2',
        ),
    }), )
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
