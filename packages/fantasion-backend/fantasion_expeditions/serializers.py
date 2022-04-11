from rest_framework.serializers import (
    HyperlinkedModelSerializer,
    SerializerMethodField,
)

from fantasion_locations.api import LocationSerializer
from fantasion_generics.api import (
    PublicMediaSerializer,
    media_fields,
    LocalPhotoSerializer,
)

from . import models
from fantasion_eshop.serializers import ProductPriceSerializer
from fantasion_people import models as people


class LeisureCentreMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.LeisureCentreMedia
        fields = media_fields


class LeisureCentreBaseSerializer(HyperlinkedModelSerializer):
    location = LocationSerializer()
    mailing_address = LocationSerializer()
    media = LeisureCentreMediaSerializer(many=True)

    class Meta:
        model = models.LeisureCentre
        fields = (
            "description",
            "detailed_description",
            "id",
            "location",
            "mailing_address",
            "media",
            "title",
        )


class LeisureCentreSerializer(LeisureCentreBaseSerializer):
    expeditions = SerializerMethodField("get_expeditions")

    class Meta:
        model = models.LeisureCentre
        fields = (
            "description",
            "detailed_description",
            "expeditions",
            "id",
            "location",
            "mailing_address",
            "media",
            "title",
        )

    def get_expeditions(self, obj):
        expedition_ids = (obj.expedition_batches.filter(
            public=True).values("id").distinct())
        serializer = PlainExpeditionSerializer(
            models.Expedition.objects.filter(
                pk__in=expedition_ids,
                public=True,
            ),
            many=True,
            context=self.context,
        )
        return serializer.data


class ExpeditionThemeMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ExpeditionThemeMedia
        fields = media_fields


class ExpeditionThemeBaseSerializer(HyperlinkedModelSerializer):
    media = ExpeditionThemeMediaSerializer(many=True)

    class Meta:
        model = models.ExpeditionTheme
        fields = (
            "id",
            "title",
            "description",
            "detailed_description",
            "media",
        )


class PlainExpeditionSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Expedition
        fields = (
            "id",
            "description",
            "detailed_description",
            "title",
        )


class ExpeditionThemeSerializer(ExpeditionThemeBaseSerializer):
    expeditions = PlainExpeditionSerializer(many=True)

    class Meta:
        model = models.ExpeditionTheme
        fields = (
            "id",
            "title",
            "description",
            "detailed_description",
            "media",
            "expeditions",
        )


class ExpeditionMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ExpeditionMedia
        fields = media_fields


class AgeGroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.AgeGroup
        fields = (
            "age_max",
            "age_min",
            "id",
            "title",
        )


class ExpeditionProgramMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.ExpeditionProgramMedia
        fields = media_fields


class ExpeditionProgramSerializer(HyperlinkedModelSerializer):
    media = ExpeditionProgramMediaSerializer(many=True)

    class Meta:
        model = models.ExpeditionProgram
        fields = (
            "id",
            "title",
            "description",
            "detailed_description",
            "media",
        )


class TroopSerializer(HyperlinkedModelSerializer):
    age_group = AgeGroupSerializer()
    prices = ProductPriceSerializer(many=True)
    program = ExpeditionProgramSerializer()

    class Meta:
        model = models.Troop
        fields = (
            "age_group",
            "ends_at",
            "id",
            "prices",
            "program",
            "starts_at",
            "price_includes",
        )


class StaffRoleSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.StaffRole
        fields = ("id", "title", "description")


class StaffProfileSerializer(HyperlinkedModelSerializer):
    avatar = LocalPhotoSerializer()

    class Meta:
        model = people.Profile
        fields = ("id", "title", "job_title", "avatar")


class BatchStaffSerializer(HyperlinkedModelSerializer):
    profile = StaffProfileSerializer()
    role = StaffRoleSerializer()

    class Meta:
        model = models.BatchStaff
        fields = ("id", "profile", "role")


class PlainExpeditionBatchSerializer(HyperlinkedModelSerializer):
    troops = TroopSerializer(many=True)
    leisure_centre = LeisureCentreBaseSerializer()

    class Meta:
        model = models.ExpeditionBatch
        fields = (
            "troops",
            "ends_at",
            "expedition",
            "id",
            "leisure_centre",
            "starts_at",
        )


class ExpeditionBatchSerializer(PlainExpeditionBatchSerializer):
    expedition = PlainExpeditionSerializer()
    staff = BatchStaffSerializer(many=True)

    class Meta:
        model = models.ExpeditionBatch
        fields = (
            "troops",
            "ends_at",
            "expedition",
            "expedition_id",
            "id",
            "leisure_centre",
            "starts_at",
            "staff",
        )


class ExpeditionSerializer(HyperlinkedModelSerializer):
    batches = SerializerMethodField("get_batches")
    media = ExpeditionMediaSerializer(many=True)
    theme = ExpeditionThemeBaseSerializer()

    class Meta:
        model = models.Expedition
        fields = (
            "id",
            "batches",
            "description",
            "detailed_description",
            "media",
            "theme",
            "title",
        )

    def get_batches(self, obj):
        serializer = PlainExpeditionBatchSerializer(
            obj.batches.filter(public=True),
            many=True,
            context=self.context,
        )
        return serializer.data
