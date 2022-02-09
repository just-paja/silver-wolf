from django.contrib.auth.models import AbstractUser
from django.db.models import BooleanField, EmailField
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    class Meta:
        db_table = "auth_user"

    username = None
    email = EmailField(
        verbose_name=_("email address"),
        unique=True,
    )
    email_verified = BooleanField(
        verbose_name=_("Verified E-mail"),
        default=False,
    )
    phone = PhoneNumberField(
        verbose_name=_("Phone Number"),
        blank=True,
        null=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
