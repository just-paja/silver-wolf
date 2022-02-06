from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        db_table = "auth_user"


"""
    email = EmailField(
        _("email address"),
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

"""
