import secrets

from django.apps import apps
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django_extensions.db.models import TimeStampedModel
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from django.db.models import (
    BooleanField,
    CASCADE,
    CharField,
    DateTimeField,
    EmailField,
    ForeignKey,
    PositiveIntegerField,
    PositiveSmallIntegerField,
    Q,
)

from phonenumber_field.modelfields import PhoneNumberField
from fantasion_generics.emails import get_lang, send_mail
from fantasion_locations.models import Address
from fantasion_signups.constants import SIGNUP_STATUS_ACTIVE
from fantasion_people.constants import get_escalated_family_roles


class FantasionUserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError('Users must have an email')

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    manager = FantasionUserManager()

    class Meta:
        db_table = "auth_user"
        verbose_name = _('User'),
        verbose_name_plural = _('Users')

    username = None
    first_name = CharField(_('Given Name'), max_length=150)
    last_name = CharField(_('Family Name'), max_length=150)
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
    password = CharField(
        _('password'),
        max_length=128,
        blank=True,
    )
    password_created = BooleanField(
        default=False,
        verbose_name=_('Has password'),
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    def get_default_invoice_address(self):
        return self.useraddress_set.first()

    def get_family_ids(self, family_role):
        roles = get_escalated_family_roles(family_role)
        members = self.family_members.filter(role__in=roles).all()
        families = self.families.all()
        return [member.family_id
                for member in members] + [family.id for family in families]

    def get_accessible_troops(self, family_role):
        family_ids = self.get_family_ids(family_role)
        Troop = apps.get_model('fantasion_expeditions', 'Troop')
        return Troop.objects.filter(
            Q(signups__order__owner=self)
            | Q(signups__participant__family__in=family_ids),
            signups__status=SIGNUP_STATUS_ACTIVE,
        ).distinct().all()

    def get_accessible_troops_and_batch_ids(self, family_role):
        troops = self.get_accessible_troops(family_role)
        troop_ids = [troop.pk for troop in troops]
        batch_ids = set([troop.batch_id for troop in troops])
        return troop_ids, batch_ids


NEXT_STEP_CREATE_PASSWORD = 1
NEXT_STEP_RESTORE_PASSWORD = 2

VERIFICATION_NEXT_STEP_OPTIONS = (
    (
        NEXT_STEP_CREATE_PASSWORD,
        _('Create password'),
    ),
    (NEXT_STEP_RESTORE_PASSWORD, _('Restore password')),
)


class EmailVerification(TimeStampedModel):

    class Meta:
        verbose_name = _('Email Verification')
        verbose_name_plural = _('Email Verifications')

    user = ForeignKey(
        User,
        on_delete=CASCADE,
        verbose_name=_('User'),
    )
    email = EmailField(
        help_text=_('Validated e-mail address'),
        verbose_name=_('email address'),
    )
    secret = CharField(
        help_text=_('User will see this next to the link'),
        max_length=63,
        verbose_name=_('Secret Key'),
    )
    expires_on = DateTimeField(
        help_text=_('User will be able to use this key until this date time.'),
        verbose_name=_('Expires on'),
    )
    next_step = PositiveSmallIntegerField(
        choices=VERIFICATION_NEXT_STEP_OPTIONS,
        verbose_name=_('Next step'),
    )
    sent = PositiveIntegerField(
        default=0,
        help_text=_('How many times was this verification sent'),
        verbose_name=_('Sent times'),
    )
    used = BooleanField(
        default=False,
        help_text=_('Has this key been used?'),
        verbose_name=_('Used'),
    )

    @staticmethod
    def generate_key():
        return secrets.token_hex(24)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.sent == 0:
            self.notify_user()

    def notify_user(self):
        if self.next_step == NEXT_STEP_CREATE_PASSWORD:
            self.send_registration_confirmation()
        elif self.next_step == NEXT_STEP_RESTORE_PASSWORD:
            self.send_password_refresh()
        self.sent += 1
        self.save()

    def get_landing_path(self):
        if self.next_step == NEXT_STEP_CREATE_PASSWORD:
            return 'potvrzeni-registrace'
        if self.next_step == NEXT_STEP_RESTORE_PASSWORD:
            return 'zapomenute-heslo'

    def get_context(self, **context):
        lang = get_lang()
        path = self.get_landing_path()
        landing_path = f'{lang}/{path}'
        base_url = settings.APP_WEBSITE_URL
        return {
            **context,
            'landing_url': f'{base_url}/{landing_path}?s={self.secret}',
            'website_url': settings.APP_WEBSITE_URL,
        }

    def send_mail(self, subject, body):
        send_mail([self.email], subject, body)

    def send_registration_confirmation(self):
        subject = _('Signup confirmation')
        self.send_mail(
            subject,
            render_to_string(
                'mail/signup_confirmation.html',
                context=self.get_context(subject=subject),
            ),
        )

    def send_password_refresh(self):
        subject = _('Forgotten password')
        self.send_mail(
            subject,
            render_to_string(
                'mail/password_refresh.html',
                context=self.get_context(subject=subject),
            ))


class UserAddressBase(Address, TimeStampedModel):

    class Meta:
        abstract = True
        verbose_name = _("User Address")
        verbose_name_plural = _("User Addresses")

    user = ForeignKey(
        User,
        on_delete=CASCADE,
    )

    def __str__(self):
        return (f"{self.street} {self.street_number}, "
                f"{self.postal_code} {self.city} ({self.user})")


class UserAddress(UserAddressBase):
    title = CharField(
        max_length=32,
        verbose_name=_("Title"),
        help_text=_(
            "Human readable identifier that will help user select this "
            "address, like \"Home\""),
    )
    country = ForeignKey(
        "fantasion_locations.Country",
        on_delete=CASCADE,
        related_name='user_addresses',
        verbose_name=_('Country'),
    )
