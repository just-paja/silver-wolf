from django import forms
from django.contrib.auth.forms import AdminPasswordChangeForm, UserCreationForm
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import password_validation
from django.utils.translation import gettext_lazy as _
from nested_admin import NestedStackedInline

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
        'fields': (
            'first_name',
            'last_name',
            'email',
            'email_verified',
            'phone',
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


class FantasionPasswordChangeForm(AdminPasswordChangeForm):

    def save(self, *args, **kwargs):
        self.user.password_created = True
        super().save(*args, **kwargs)


class UserAddressAdmin(NestedStackedInline):
    model = models.UserAddress
    extra = 0
    fields = (
        'title',
        'country',
        'city',
        'street',
        'street_number',
        'postal_code',
    )


class UserAdmin(BaseAdmin, auth_admin.UserAdmin):
    model = models.User
    inlines = (UserAddressAdmin, )
    ordering = ('last_name', )
    add_form = FantasionUserCreationForm
    change_password_form = FantasionPasswordChangeForm
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    fieldsets = (
        fieldset_personal,
        fieldset_security,
        fieldset_permissions,
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
        'password_created',
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
