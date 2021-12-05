from django.utils.translation import ugettext_lazy as _
from django.db.models import BooleanField, ForeignKey, CASCADE, SET_DEFAULT
from django.contrib.auth.models import User

from fantasion_generics.models import MediaObjectModel, PublicModel


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

