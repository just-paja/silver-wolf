from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    BooleanField,
    ForeignKey,
    PositiveIntegerField,
    CASCADE,
    RESTRICT,
    SET_DEFAULT,
)

from fantasion_generics.models import MediaObjectModel, NamedModel, PublicModel
from fantasion_generics.titles import TitleField


class Profile(PublicModel):
    public = BooleanField(
        help_text=_('Public profiles will be visible on the website'),
        default=False,
    )
    owner = ForeignKey(
        User,
        blank=True,
        default=None,
        help_text=_('Owner of the profile will be able to edit the profile'),
        null=True,
        on_delete=SET_DEFAULT,
        related_name='profiles',
    )


class ProfileMedia(MediaObjectModel):
    parent = ForeignKey(
        Profile,
        related_name='media',
        on_delete=CASCADE,
    )


class Allergy(NamedModel):
    pass


class Sport(NamedModel):
    pass


class Family(TimeStampedModel):
    title = TitleField()
    owner = ForeignKey(
        User,
        on_delete=RESTRICT,
        related_name='families',
        help_text=_('Family owner acts as a superadmin.'),
    )

    def get_family_member_by_user(self, user):
        return self.members.filter(user=user).first()

    def can_user_own_order(self, user):
        return bool(self.get_family_member_by_user(user))


# Admin can assign family roles
FAMILY_ROLE_ADMIN = 1
# Representative can submit signups
FAMILY_ROLE_REPRESENTATIVE = 2
# Spectator can view content
FAMILY_ROLE_SPECTATOR = 3

FAMILY_ROLE_CHOICES = (
    (FAMILY_ROLE_ADMIN, _('Administrator')),
    (FAMILY_ROLE_REPRESENTATIVE, _('Legal representative')),
    (FAMILY_ROLE_SPECTATOR, _('Spectator')),
)


class FamilyMember(TimeStampedModel):
    family = ForeignKey(
        Family,
        on_delete=CASCADE,
        related_name='members',
    )
    user = ForeignKey(
        User,
        on_delete=CASCADE,
        related_name='family_members',
    )
    role = PositiveIntegerField(
        choices=FAMILY_ROLE_CHOICES,
        default=FAMILY_ROLE_SPECTATOR,
    )
