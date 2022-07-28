from django.utils.translation import ugettext_lazy as _

# Admin can assign family roles
FAMILY_ROLE_ADMIN = 1
# Representative can submit signups
FAMILY_ROLE_REPRESENTATIVE = 2
# Spectator can view content
FAMILY_ROLE_SPECTATOR = 3

FAMILY_ROLE_CHOICES = (
    (FAMILY_ROLE_ADMIN, _("Administrator")),
    (FAMILY_ROLE_REPRESENTATIVE, _("Legal representative")),
    (FAMILY_ROLE_SPECTATOR, _("Spectator")),
)
