import json

from django.db.migrations.serializer import Serializer
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import exceptions


from apis.studypods.serializers import StudyPodSerializer, StudypodAccessCodeSerializer
from apis.studypods.services import encrypt_text, decrypt_data

from common.models import StudyPod


class StudyPodAPIView(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = StudyPodSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = None

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug', None)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if self.slug is None:
            return super().list(request, *args, **kwargs)
        return super().retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if self.slug is None:
            raise exceptions.MethodNotAllowed('PATCH')
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if self.slug is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)

        payload = {'detail': 'Studypod has been successfully deleted.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_queryset(self):
        return StudyPod.groups.filter(owner=self.request.user)

    def get_serializer_context(self):
        return {'owner': self.request.user}

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class StudyPodGenerateEncryptedUserIDAPIView(APIView):
    def post(self, request, *args, **kwargs):
        payload = {'data': str(encrypt_text(str(request.user.id)))}
        return Response(payload, status=status.HTTP_200_OK)


class JoinStudypodAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = StudypodAccessCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self._add_user_to_studypod(serializer.studypod)

        payload = StudyPodSerializer(serializer.studypod).data
        return Response(payload, status=status.HTTP_200_OK)

    def _add_user_to_studypod(self, studypod):
        user_id = self.request.user.id
        try:
            studypod.members.index(user_id)
            user_is_in_the_studypod = True
        except ValueError:
            user_is_in_the_studypod = False

        if not user_is_in_the_studypod:
            studypod.members.append(user_id)
            studypod.save()