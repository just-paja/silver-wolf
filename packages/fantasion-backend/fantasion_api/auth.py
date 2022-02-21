from rest_framework import authentication
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication


class CsrfExemptAuth(SessionAuthentication):
    def enforce_csrf(self, request):
        return
