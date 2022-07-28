from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django_extensions.db.models import TimeStampedModel
from django.db.models import (
    CharField,
    ForeignKey,
    PositiveIntegerField,
    CASCADE,
    RESTRICT,
    SET_DEFAULT,
)

from fantasion_generics.upload_path import kebab
from fantasion_generics.photos import LocalPhotoField, WarmPhotoModel
from fantasion_generics.media import MediaParentField
from fantasion_generics.titles import TitleField
from fantasion_generics.models import (
    ImportanceField,
    MarkdownField,
    MediaObjectModel,
    NamedModel,
    PublicModel,
    VisibilityField,
)

from .constants import (
    FAMILY_ROLE_SPECTATOR,
    FAMILY_ROLE_CHOICES,
)


class Profile(PublicModel, WarmPhotoModel):

    class Meta:
        ordering = ["-importance"]
        verbose_name = _("Profile")
        verbose_name_plural = _("Profiles")

    job_title = CharField(
        blank=True,
        max_length=63,
        null=True,
        verbose_name=_("Job Title"),
        help_text=_(
            "Extremely short description of the relationship between this "
            "person and Fantasion, three or four words ideal"),
    )
    avatar = LocalPhotoField()
    text = MarkdownField(
        blank=True,
        help_text=_("Full text of the profile formatted in Markdown"),
        null=True,
        verbose_name=_("Profile text"),
    )
    importance = ImportanceField()
    public = VisibilityField()
    owner = ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        default=None,
        help_text=_("Owner of the profile will be able to edit the profile"),
        null=True,
        on_delete=SET_DEFAULT,
        related_name="profiles",
    )

    @property
    def upload_dir(self):
        return "{0}/{1}".format(
            kebab(self.__class__.__name__),
            self.id,
        )


class ProfileMedia(MediaObjectModel):
    parent = MediaParentField(Profile, )


class Allergy(NamedModel):

    class Meta:
        verbose_name = _("Allergy")
        verbose_name_plural = _("Allergies")

    title = TitleField(unique=True)


class Diet(NamedModel):

    class Meta:
        verbose_name = _("Diet")
        verbose_name_plural = _("Diets")

    title = TitleField(unique=True)


class Hobby(NamedModel):

    class Meta:
        verbose_name = _("Hobby")
        verbose_name_plural = _("Hobbies")

    title = TitleField(unique=True)


class Family(TimeStampedModel):

    class Meta:
        verbose_name = _("Family")
        verbose_name_plural = _("Families")

    title = TitleField()
    owner = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=RESTRICT,
        related_name="families",
        help_text=_("Family owner acts as a superadmin."),
    )

    def get_family_member_by_user(self, user):
        return self.members.filter(user=user).first()

    def can_user_own_order(self, user):
        return bool(self.get_family_member_by_user(user))

    def __str__(self):
        return self.title

    @property
    def upload_dir(self):
        return "{0}/{1}".format(
            kebab(self.__class__.parent.field.remote_field.model.__name__),
            self.parent_id,
        )


class FamilyMember(TimeStampedModel):

    class Meta:
        verbose_name = _("Family member")
        verbose_name_plural = _("Family members")

    family = ForeignKey(
        Family,
        on_delete=CASCADE,
        related_name="members",
        verbose_name=_("Family"),
    )
    user = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=CASCADE,
        related_name="family_members",
        verbose_name=_("User"),
    )
    role = PositiveIntegerField(
        choices=FAMILY_ROLE_CHOICES,
        default=FAMILY_ROLE_SPECTATOR,
        verbose_name=_("Family Role"),
    )
