from django.conf.urls.static import static
from django.conf import settings
from django.urls import include, path

from fantasion_api.views import error404
from fantasion_domain import views as sso

from .admin import CONTENT_ADMIN

urlpatterns = [
    path("api/v1/", include("fantasion_api.urls")),
    path("admin/", CONTENT_ADMIN.urls),
    path("sso/callback", sso.callback, name="sso_callback"),
    path("sso/login", sso.authorize, name="sso_login"),
    path("", sso.gauth),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

handler404 = error404
