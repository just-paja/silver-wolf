from django.urls import include, path

from .admin import CONTENT_ADMIN

urlpatterns = [
    path('api/v1/', include('fantasion_api.urls')),
    path('admin/', CONTENT_ADMIN.urls),
]
