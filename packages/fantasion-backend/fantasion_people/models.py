from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    ForeignKey,
    PositiveIntegerField,
    TextField,
    CASCADE,
    RESTRICT,
    SET_DEFAULT,
)

from fantasion_generics.media import MediaParentField
from fantasion_generics.titles import TitleField
from fantasion_generics.models import (
    MediaObjectModel,
    NamedModel,
    PublicModel,
    VisibilityField,
)


class Profile(PublicModel):
    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')

    text = TextField(
        verbose_name=_('Profile text'),
        help_text=_('Full text of the profile formatted in Markdown'),
    )
    public = VisibilityField()
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
    parent = MediaParentField(Profile, )


class Allergy(NamedModel):
    class Meta:
        verbose_name = _('Allergy')
        verbose_name_plural = _('Allergies')


class Hobby(NamedModel):
    class Meta:
        verbose_name = _('Hobby')
        verbose_name_plural = _('Hobbies')


class Family(TimeStampedModel):
    class Meta:
        verbose_name = _('Family')
        verbose_name_plural = _('Families')

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
    class Meta:
        verbose_name = _('Family member')
        verbose_name_plural = _('Family members')

    family = ForeignKey(
        Family,
        on_delete=CASCADE,
        related_name='members',
        verbose_name=_('Family'),
    )
    user = ForeignKey(
        User,
        on_delete=CASCADE,
        related_name='family_members',
        verbose_name=_('User'),
    )
    role = PositiveIntegerField(
        choices=FAMILY_ROLE_CHOICES,
        default=FAMILY_ROLE_SPECTATOR,
        verbose_name=_('Family Role'),
    )
