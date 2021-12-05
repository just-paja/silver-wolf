from django.db.models import Model, PositiveBigIntegerField


class MediaModelMixin(Model):
    class Meta:
        abstract = True

    height = PositiveBigIntegerField(blank=True, null=True)
    width = PositiveBigIntegerField(blank=True, null=True)
