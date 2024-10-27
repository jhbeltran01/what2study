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

from apis.studypods.serializers import (
    StudypodSerializer,
    StudypodAccessCodeSerializer,
    StudypodReviewerSerializer
)
from apis.studypods.services import (
    encrypt_text,
    add_user_to_studypod,
    is_member_of_studypod,
    leave_studypod,
    retrieve_reviewer,
)

from common.models import StudyPod, StudypodReviewer


class StudyPodAPIView(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = StudypodSerializer
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
        kwargs['partial'] = True
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

        add_user_to_studypod(serializer.studypod, self.request.user.id)

        payload = StudypodSerializer(serializer.studypod).data
        return Response(payload, status=status.HTTP_200_OK)


class LeaveStudypodAPIView(APIView):
    def post(self, request, *args, **kwargs):
        slug = kwargs.get('slug')

        studypod = StudyPod.groups.filter(slug=slug).first()

        if studypod is None:
            return Response({'details': 'Studypod not found.'}, status=status.HTTP_404_NOT_FOUND)

        user_id = request.user.id
        is_member = is_member_of_studypod(studypod, user_id)

        if not is_member:
            return Response({'details': 'You are not a member of the studypod'}, status=status.HTTP_400_BAD_REQUEST)

        if is_member:
            leave_studypod(studypod, user_id)

        return Response({'details': 'You successfully leave the studypod.'}, status=status.HTTP_200_OK)


class StudypodReviewersAPIView(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = StudypodReviewerSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.studypod_slug = None
        self.reviewer_slug = None

    def dispatch(self, request, *args, **kwargs):
        self.studypod_slug = kwargs.get('studypod_slug', None)
        self.reviewer_slug = kwargs.get('reviewer_slug', None)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if self.reviewer_slug is not None: # retrieve single reviewer
            return super().retrieve(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if self.studypod_slug is None:
            raise exceptions.MethodNotAllowed('POST')
        return super().create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if self.reviewer_slug is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)

        payload = {'detail': 'Reviewer has been deleted successfully.'}
        return Response(payload, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        if self.reviewer_slug is None:
            raise exceptions.MethodNotAllowed('PATCH')
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        return StudypodReviewer.reviewers.filter(studypod__slug=self.studypod_slug)

    def get_object(self):
        reviewer = retrieve_reviewer(
            reviewer_slug=self.reviewer_slug,
            studypod_slug=self.studypod_slug,
        )

        if reviewer is None:
            raise exceptions.NotFound('Reviewer not found.')

        return reviewer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {'owner': self.request.user}