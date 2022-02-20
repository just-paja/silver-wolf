from datetime import timedelta
from django.http import Http404
from django.urls import path
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import (
    CharField,
    EmailField,
    ModelSerializer,
    Serializer,
    ValidationError,
)

from fantasion import models

from .auth import CsrfExemptAuth
from .decorators import public_endpoint, with_serializer


class CreatePasswordSerializer(Serializer):
    password = CharField(max_length=128, min_length=6)
    password_confirm = CharField(max_length=128, min_length=6)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise ValidationError(
                _('Password does not match the confirmation value'), )
        return data


class RestorePasswordSerializer(Serializer):
    email = EmailField()

    def validate_email(self, value):
        try:
            models.User.objects.filter(email=value).get()
        except models.User.DoesNotExist:
            raise ValidationError(_('User does not exist'))
        return value


class RegistrationSerializer(ModelSerializer):

    class Meta:
        model = models.User
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'email_verified',
            'password_created',
            'phone',
        )
        extra_kwargs = {
            'first_name': {
                'required': True,
            },
            'last_name': {
                'required': True,
            },
            'phone': {
                'required': True,
            },
        }

    def create(self, validated_data):
        user = models.User(**validated_data)
        user.save()
        expires_on = timezone.now() + timedelta(days=5)
        verification = models.EmailVerification(
            email=user.email,
            expires_on=expires_on,
            next_step=models.NEXT_STEP_CREATE_PASSWORD,
            secret=models.EmailVerification.generate_key(),
            user=user,
        )
        verification.save()
        return user


class PublicView(APIView):
    authentication_classes = (CsrfExemptAuth, )
    permission_classes = ()

    @classmethod
    def get_extra_actions(cls):
        return []


@public_endpoint(['POST'])
@with_serializer(RegistrationSerializer)
def register(request, serializer, format=None):
    erializer.save()
    token = get_token(user_id=serializer.data['id'])
    return Response(
        {
            'user': serializer.data,
            'token': token.key,
        },
        status=status.HTTP_201_CREATED,
    )


def get_token(**kwargs):
    token_tuple = Token.objects.get_or_create(**kwargs)
    return token_tuple[0]


def find_verification(**kwargs):
    return models.EmailVerification.objects.filter(
        **kwargs,
        expires_on__gt=timezone.now(),
        used=False,
    ).get()


@public_endpoint(['GET'])
def get_verification(request, secret, format=None):
    try:
        verification = find_verification(secret=secret)
        token = get_token(user=verification.user)
        return Response(
            {
                'user': RegistrationSerializer(verification.user).data,
                'token': token.key,
            },
            status=status.HTTP_200_OK,
        )
    except models.EmailVerification.DoesNotExist as exc:
        raise Http404 from exc


@public_endpoint(['POST'])
@with_serializer(CreatePasswordSerializer)
def create_password(request, serializer, secret, format=None):
    try:
        verification = find_verification(
            secret=secret,
            next_step__in=(
                models.NEXT_STEP_CREATE_PASSWORD,
                models.NEXT_STEP_RESTORE_PASSWORD,
            ),
        )
        user = verification.user
        user.set_password(serializer.data['password'])
        user.password_created = True
        user.save()
        verification.used = True
        verification.save()
        token = get_token(user=user)
        return Response(
            {
                'user': RegistrationSerializer(user).data,
                'token': token.key,
            },
            status=status.HTTP_200_OK,
        )
    except models.EmailVerification.DoesNotExist as exc:
        raise Http404 from exc


@public_endpoint(['POST'])
@with_serializer(RestorePasswordSerializer)
def request_password_restore(request, serializer, format=None):
    data = serializer.data
    user = models.User.objects.get(email=data['email'])
    expires_on = timezone.now() + timedelta(days=5)
    verification = models.EmailVerification(
        email=user.email,
        expires_on=expires_on,
        next_step=models.NEXT_STEP_RESTORE_PASSWORD,
        secret=models.EmailVerification.generate_key(),
        user=user,
    )
    verification.save()
    return Response(None, status=status.HTTP_204_NO_CONTENT)


urlpatterns = [
    path('create-password/<secret>', create_password),
    path('register', register),
    path('restore-password', request_password_restore),
    path('verifications/<secret>', get_verification),
]
