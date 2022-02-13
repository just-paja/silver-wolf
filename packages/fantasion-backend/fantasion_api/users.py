from datetime import timedelta
from django.http import Http404
from django.utils import timezone

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView
from fantasion import models


class RegistrationSerializer(ModelSerializer):
    class Meta:
        model = models.User
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
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


class RegisterView(APIView):
    permission_classes = ()

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            token = get_token(serializer.data)
            return Response(
                {
                    'user': serializer.data,
                    'token': token.key,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_token(user):
    token_tuple = Token.objects.get_or_create(user=user)
    return token_tuple[0]


class CreatePasswordView(APIView):
    permission_classes = ()

    @classmethod
    def get_extra_actions(cls):
        return []

    def get_verification(self, secret):
        return models.EmailVerification.objects.filter(
            expires_on__gt=timezone.now(),
            next_step=models.NEXT_STEP_CREATE_PASSWORD,
            secret=secret,
            used=False,
        ).get()

    def get(self, request, secret, format=None):
        try:
            verification = get_verification()
            token = get_token(verification.user)
            return Response(
                {
                    'user': RegistrationSerializer(verification.user).data,
                    'token': token.key,
                },
                status=status.HTTP_200_OK,
            )
        except models.EmailVerification.DoesNotExist as exc:
            raise Http404 from exc

    def post(self, request, secret, format=None):
        try:
            verification = self.get_verification()
            verification.used = True
            verification.save()
            request.user.set_password(request.data)
            request.user.save()
            return Response(
                None,
                status=status.HTTP_204_NO_CONTENT,
            )
        except models.EmailVerification.DoesNotExist as exc:
            raise Http404 from exc
