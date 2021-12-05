from django.core.files.base import File
from django.core import checks
from django.db.models import Model, PositiveBigIntegerField
from django.db.models.fields.files import FileField, FieldFile, FileDescriptor
from django.utils.translation import ugettext_lazy as _

from .upload_path import get_upload_path


def get_video_meta(instance, close):
    return {
        'duration': None,
        'height': None,
        'width': None,
    }


class VideoFile(File):
    """
    A mixin for use alongside django.core.files.base.File, which provides
    additional features for dealing with images.
    """
    @property
    def width(self):
        return self.get_video_meta().width

    @property
    def height(self):
        return self.get_video_meta().height

    @property
    def duration(self):
        return self.get_video_meta().duration

    def get_video_meta(self):
        if not hasattr(self, 'dimensions_cache'):
            close = self.closed
            self.open()
            self.dimensions_cache = get_video_meta(self, close)
        return self.dimensions_cache


class VideoFileDescriptor(FileDescriptor):

    def __set__(self, instance, value):
        previous_file = instance.__dict__.get(self.field.attname)
        super().__set__(instance, value)

        if previous_file is not None:
            self.field.update_dimension_fields(instance, force=True)


class VideoFieldFile(VideoFile, FieldFile):
    def delete(self, save=True):
        if hasattr(self, 'dimensions_cache'):
            del self.dimensions_cache
        super().delete(save)


class VideoField(FileField):
    attr_class = VideoFieldFile
    descriptor_class = VideoFileDescriptor
    description = _('Video')

    def __init__(
        self,
        duration_field=None,
        height_field=None,
        width_field=None,
        *args,
        **kwargs
    ):
        self.duration_field = duration_field
        self.height_field = height_field
        self.width_field = width_field
        super().__init__(*args, **kwargs)

    def check(self, **kwargs):
        return [
            *super().check(**kwargs),
            *self.check_library_installed(),
        ]

    def check_library_installed(self):
        try:
            import ffmpeg
        except ImportError:
            return [
                checks.Error(
                    'Cannot use VideoField, because ffmpeg is not installed.',
                    hint=('Install ffmpeg library using poetry'),
                    obj=self,
                    id='fields.E210',
                )
            ]
        return []

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if self.duration_field:
            kwargs['duration_field'] = self.duration_field
        if self.height_field:
            kwargs['height_field'] = self.height_field
        if self.width_field:
            kwargs['width_field'] = self.width_field
        return name, path, args, kwargs

    def has_meta_fields(self):
        return self.duration_field or self.height_field or self.width_field

    def has_meta_values(self):
        dimension_fields_filled = not(
            (self.duration_field and not getattr(instance, self.duration_field)) or
            (self.height_field and not getattr(instance, self.height_field)) or
            (self.width_field and not getattr(instance, self.width_field))
        )

    def update_dimension_fields(self, instance, force=False, *args, **kwargs):
        # Nothing to update if the field doesn't have dimension fields or if
        # the field is deferred.
        has_dimension_fields = self.has_meta_fields()
        if not has_dimension_fields or self.attname not in instance.__dict__:
            return

        # getattr will call the ImageFileDescriptor's __get__ method, which
        # coerces the assigned value into an instance of self.attr_class
        # (ImageFieldFile in this case).
        file = getattr(instance, self.attname)

        # Nothing to update if we have no file and not being forced to update.
        if not file and not force:
            return

        dimension_fields_filled = self.has_meta_values()
        
        # When both dimension fields have values, we are most likely loading
        # data from the database or updating an image field that already had
        # an image stored.  In the first case, we don't want to update the
        # dimension fields because we are already getting their values from the
        # database.  In the second case, we do want to update the dimensions
        # fields and will skip this return because force will be True since we
        # were called from ImageFileDescriptor.__set__.
        if dimension_fields_filled and not force:
            return

        # file should be an instance of ImageFieldFile or should be None.
        if file:
            duration = file.duration
            height = file.height
            width = file.width
        else:
            # No file, so clear dimensions fields.
            duration = None
            height = None
            width = None

        # Update the width and height fields.
        if self.duration_field:
            setattr(instance, self.duration_field, duration)
        if self.height_field:
            setattr(instance, self.height_field, height)
        if self.width_field:
            setattr(instance, self.width_field, width)


class LocalVideoModel(Model):
    class Meta:
        abstract = True

    local_video_image = VideoField(
        blank=True,
        duration_field='local_video_duration',
        height_field='local_video_height',
        max_length=255,
        null=True,
        upload_to=get_upload_path,
        verbose_name=_('Video file'),
        width_field='local_video_width',
    )
    local_video_duration = PositiveBigIntegerField(blank=True, null=True)
    local_video_height = PositiveBigIntegerField(blank=True, null=True)
    local_video_width = PositiveBigIntegerField(blank=True, null=True)

