from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class FantasionDomainConfig(AppConfig):
    name = "fantasion_domain"
    verbose_name = _("Fantasion Domain")
