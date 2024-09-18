
from django.conf import settings
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin
)
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from apis.studypods.serializers import StudyPodSerializer
from apis.studypods.services import encrypt_text, decrypt_data

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


class StudyPodGenerateEncryptedUserID(APIView):
    def post(self, request, *args, **kwargs):
        payload = {'data': str(encrypt_text(str(request.user.id)))}
        return Response(payload, status=status.HTTP_200_OK)
