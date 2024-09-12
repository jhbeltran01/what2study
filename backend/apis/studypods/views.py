from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin
)
from rest_framework.generics import GenericAPIView

from apis.studypods.serializers import StudyPodSerializer

from common.models import StudyPod


class StudyPodAPIView(
    ListModelMixin,
    RetrieveModelMixin,
    GenericAPIView
):
    serializer_class = StudyPodSerializer

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return StudyPod.groups.filter(owner=self.request.user)