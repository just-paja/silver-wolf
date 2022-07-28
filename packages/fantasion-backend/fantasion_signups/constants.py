from django.utils.translation import ugettext_lazy as _

SIGNUP_STATUS_NEW = 1
SIGNUP_STATUS_CONFIRMED = 2
SIGNUP_STATUS_ACTIVE = 3
SIGNUP_STATUS_CANCELLED = 5

SIGNUP_STATES = (
    (SIGNUP_STATUS_NEW, _("New")),
    (SIGNUP_STATUS_CONFIRMED, _("Confirmed")),
    (SIGNUP_STATUS_ACTIVE, _("Active")),
    (SIGNUP_STATUS_CANCELLED, _("Cancelled")),
)
