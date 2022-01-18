from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from . import models


class StaticArticleSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.StaticArticle
        fields = ['id', 'title', 'description', 'key']


class StaticArticleView(ReadOnlyModelViewSet):
    queryset = models.StaticArticle.objects.all()
    serializer_class = StaticArticleSerializer
    lookup_field = 'key'
