from fantasion_generics.admin import BaseAdmin

from . import models


class ParticipantAdmin(BaseAdmin):
    model = models.Participant


class SignupAdmin(BaseAdmin):
    model = models.Signup
