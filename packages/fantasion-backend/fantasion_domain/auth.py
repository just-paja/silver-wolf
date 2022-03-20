from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from admin_sso.default_settings import ASSIGNMENT_MATCH
from admin_sso.models import Assignment


def is_a_god(email):
    return email == settings.DJANGO_ADMIN_SSO_SUPERUSER


def is_in_domain(email):
    return email.endswith(f"@{settings.DJANGO_ADMIN_SSO_DOMAIN}")


def setup_group(group):
    try:
        return Group.objects.get(name=group.get("email"))
    except Group.DoesNotExist:
        group = Group(name=group.get("email"))
        group.save()
        return group


def setup_groups(user, groups):
    for group_info in groups:
        group = setup_group(group_info)
        user.groups.add(group)


class SSOAuthBackend:
    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def ensure_user_existence(self, sso_email):
        User = get_user_model()
        try:
            return User.objects.get(email=sso_email)
        except User.DoesNotExist:
            user = User(email=sso_email)
            user.save()
            return user

    def authenticate(self, request=None, **kwargs):
        sso_email = kwargs.pop("sso_email", None)
        if not sso_email:
            return None

        assignment = Assignment.objects.for_email(sso_email)
        if assignment is None:
            try:
                username, domain = sso_email.split("@")
            except ValueError:
                return None
            user = self.ensure_user_existence(sso_email)
            assignment = Assignment(
                domain=domain,
                user=user,
                username_mode=ASSIGNMENT_MATCH,
                username=username,
            )
            assignment.save()

        user = assignment.user
        user.first_name = kwargs.get("first_name", None)
        user.last_name = kwargs.get("last_name", None)
        user.is_staff = is_in_domain(sso_email)
        user.is_superuser = is_a_god(sso_email)
        setup_groups(user, kwargs.get("groups", []))
        user.save()
        return assignment.user
