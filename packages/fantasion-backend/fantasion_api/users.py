from datetime import timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from django.urls import path
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import (
    CharField,
    EmailField,
    ModelSerializer,
    Serializer,
    ValidationError,
)

from fantasion import models
from fantasion_generics.api import RWViewSet

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


class LoginSerializer(Serializer):
    email = EmailField()
    password = CharField()
    user = None

    def validate(self, values):
        user = authenticate(
            email=values['email'],
            password=values['password'],
        )
        if user:
            self.user = user
            return values
        raise ValidationError(
            _('Invalid combination of e-mail and password')
        )


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


@public_endpoint(['POST'])
@with_serializer(LoginSerializer)
def login(request, serializer, format=None):
    token = get_token(user=serializer.user)
    return Response(
        {
            'user': RegistrationSerializer(serializer.user).data,
            'token': token.key,
        },
        status=status.HTTP_200_OK,
    )


@public_endpoint(['POST'])
@with_serializer(RegistrationSerializer)
def register(request, serializer, format=None):
    serializer.save()
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request, format=None):
    user = request.user
    if isinstance(user, AnonymousUser):
        user = None
    return Response(RegistrationSerializer(user).data)


class UserAddressSerializer(ModelSerializer):
    class Meta:
        model = models.UserAddress
        fields = (
            'city',
            'country',
            'id',
            'postal_code',
            'street',
            'street_number',
            'title',
        )

    def create(self, data):
        inst = models.UserAddress(
            **data,
            user=self.context.get('request').user,
        )
        inst.save()
        return inst


class UserAddressCollection(RWViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.UserAddress.objects.filter(user=self.request.user)


urlpatterns = [
    path('create-password/<secret>', create_password),
    path('get-token', login),
    path('me', get_me),
    path('register', register),
    path('restore-password', request_password_restore),
    path('verifications/<secret>', get_verification),
]
