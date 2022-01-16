from django.conf.urls.static import static
from django.conf import settings
from django.urls import include, path

from .admin import CONTENT_ADMIN

urlpatterns = [
    path('api/v1/', include('fantasion_api.urls')),
    path('admin/', CONTENT_ADMIN.urls),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
