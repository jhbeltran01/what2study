from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from apis.reviewers.serializers import ReviewerSerializer
from apis.subjects.serializers import SubjectSerializer
from common.models import Subject, Reviewer, SubjectReviewer


class SubjectAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = SubjectSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = None

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug', None)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if self.slug is not None:
            return super().retrieve(request, *args, **kwargs)

        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if self.slug is None:
            raise MethodNotAllowed('PATCH')

        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if self.slug is None:
            raise MethodNotAllowed('PATCH')

        super().destroy(request, *args, **kwargs)
        return Response({'detail': 'Subject is successfully deleted'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {'owner': self.request.user}

    def get_queryset(self):
        return Subject.subjects.filter(owner=self.request.user)


class SubjectReviewerAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = ReviewerSerializer
    lookup_field = 'slug'
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subject = None

    def dispatch(self, request, *args, **kwargs):
        kwargs['slug'] = kwargs.get('reviewer', None)
        self.subject = Subject.subjects.filter(slug=kwargs['subject']).first()

        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if kwargs['slug'] is not None:
            return super().retrieve(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if self.subject is None:
            raise NotFound('Subject not found')

        return super().create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if kwargs['slug'] is None:
            raise MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)
        return Response({'detail': 'Reviewer has been deleted.'}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.subject.delete()
        instance.delete()

    def perform_create(self, serializer):
        reviewer = serializer.save(owner=self.request.user)

        SubjectReviewer.reviewers.create(
            owner=self.request.user,
            reviewer=reviewer,
            subject=self.subject
        )

    def get_serializer_context(self):
        return {'owner': self.request.user}

    def get_queryset(self):
        reviewers_id = [subject.reviewer.id for subject in self.subject.reviewers.all()]
        return Reviewer.reviewers.filter(id__in=reviewers_id).order_by('-created_at')