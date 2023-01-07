from django.utils.translation import gettext_lazy as _

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


def get_escalated_family_roles(family_role):
    if family_role == FAMILY_ROLE_SPECTATOR:
        return [
            FAMILY_ROLE_SPECTATOR,
            FAMILY_ROLE_REPRESENTATIVE,
            FAMILY_ROLE_ADMIN,
        ]

    if family_role == FAMILY_ROLE_REPRESENTATIVE:
        return [FAMILY_ROLE_REPRESENTATIVE, FAMILY_ROLE_ADMIN]

    return [family_role]
