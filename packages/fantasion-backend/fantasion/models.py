import re
import secrets

from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core import mail
from django_extensions.db.models import TimeStampedModel
from django.template.loader import render_to_string
from django.utils.html import strip_tags
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
)

from phonenumber_field.modelfields import PhoneNumberField


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
    password_created = BooleanField(
        default=False,
        verbose_name=_('Has password'),
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"


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

    def get_sender(self):
        return '{} <{}>'.format(
            settings.EMAIL_ROBOT_NAME,
            settings.EMAIL_ROBOT_ADDR,
        )

    def get_lang(self):
        return 'cs'

    def get_landing_path(self):
        if self.next_step == NEXT_STEP_CREATE_PASSWORD:
            return 'potvrzeni-registrace'
        if self.next_step == NEXT_STEP_RESTORE_PASSWORD:
            return 'zapomenute-heslo'

    def get_context(self, **context):
        lang = self.get_lang()
        path = self.get_landing_path()
        landing_path = f'{lang}/{path}'
        base_url = settings.APP_WEBSITE_URL
        return {
            **context,
            'landing_url': f'{base_url}/{landing_path}?s={self.secret}',
            'website_url': settings.APP_WEBSITE_URL,
        }

    def get_text_body(self, body):
        body_index = body.find('<body>')
        plain = strip_tags(body[body_index:]).strip()
        plain = re.sub(r'([ ]+\n)', r'\n', plain)
        return re.sub(r'(\n[ ]+)', r'\n', plain)

    def send_mail(self, subject, body):
        site_name = _('Fantasion')
        mail.send_mail(
            f'{site_name}: {subject}',
            self.get_text_body(body),
            self.get_sender(),
            [self.email],
            html_message=body,
            fail_silently=False,
        )

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
