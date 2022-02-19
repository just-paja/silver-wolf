from rest_framework import authentication, exceptions
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication


class CsrfExemptAuth(SessionAuthentication):
    def enforce_csrf(self, request):
        return


class TokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        secret = request.META.get('X-Auth-Token')
        try:
            token = Token.objects.get(key=secret)
            user = token.user
            if user.active:
                return user
        except Token.DoesNotExist:
            return None
        return None
