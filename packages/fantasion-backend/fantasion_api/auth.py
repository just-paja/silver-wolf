from rest_framework.authentication import SessionAuthentication


class CsrfExemptAuth(SessionAuthentication):

    def enforce_csrf(self, request):
        return
