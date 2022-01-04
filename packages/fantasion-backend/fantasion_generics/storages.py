from django.conf import settings
from django.utils.functional import LazyObject
from django.utils.module_loading import import_string
from storages.backends.gcloud import GoogleCloudStorage

MediaStorage = lambda: GoogleCloudStorage(location='media')
StaticStorage = lambda: GoogleCloudStorage(location='static')

def get_private_storage_class(import_path=None):
    return import_string(
        import_path or
        settings.PRIVATE_FILE_STORAGE
    )


class PrivateStorage(LazyObject):
    def _setup(self):
        self._wrapped = get_private_storage_class()()


private_storage = PrivateStorage()
