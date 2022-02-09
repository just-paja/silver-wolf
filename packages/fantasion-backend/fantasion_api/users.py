from datetime import timedelta
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView
from fantasion import models


class RegistrationSerializer(ModelSerializer):
    class Meta:
        model = models.User
        fields = (
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
