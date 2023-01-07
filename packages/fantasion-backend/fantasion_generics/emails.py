import re

from django.conf import settings
from django.core import mail
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _


def get_lang():
    return 'cs'


def get_sender():
    return '{} <{}>'.format(
        settings.EMAIL_ROBOT_NAME,
        settings.EMAIL_ROBOT_ADDR,
    )


def get_text_body(body):
    body_index = body.find('<body>')
    plain = strip_tags(body[body_index:]).strip()
    plain = re.sub(r'([ ]+\n)', r'\n', plain)
    return re.sub(r'(\n[ ]+)', r'\n', plain)


def send_mail(recipients, subject, body):
    site_name = _('Fantasion')
    return mail.send_mail(
        f'{site_name}: {subject}',
        get_text_body(body),
        get_sender(),
        recipients,
        html_message=body,
        fail_silently=False,
    )
