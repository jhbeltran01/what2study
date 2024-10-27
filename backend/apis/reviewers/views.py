from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework import status

from common.models import Reviewer, PublicReviewer

from .serializers import (
    ReviewerSerializer,
    PublicReviewerSerializer, RetrievePublicReviewerSerializer,
)
from .services import (
    Document,
)


class ReviewersAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = ReviewerSerializer
    lookup_field = 'slug'
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = ''
        self.is_get_reviewer = ''
        self.files = ''

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug', None)
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        self.files = request.FILES.getlist('files')
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.is_get_reviewer = self.slug is not None

        if self.is_get_reviewer:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        document = Document(
            files=self.files,
            owner=self.request.user,
        )
        reviewer = serializer.save(
            owner=self.request.user,
            content=document.generate_text(),
        )
        document.convert_text_to_content(reviewer)
        reviewer.available_question_types = document.question_types
        reviewer.save()

    def patch(self, request, *args, **kwargs):
        if self.slug is not None:
            raise exceptions.MethodNotAllowed('PATCH')
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def get_queryset(self):
        return Reviewer.reviewers.filter(owner=self.request.user)
    
    def get_object(self):
        return Reviewer.reviewers.get(slug=self.slug)
    
    def get_serializer_context(self):
        return {'owner': self.request.user}


class PublicizeReviewerAPIView(
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    GenericAPIView
):
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = None
        self.is_get_method = False

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug')
        self.is_get_method = request.method == 'GET'
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if self.slug is None:
            raise exceptions.MethodNotAllowed('DELETE')

        super().destroy(request, *args, **kwargs)
        payload = {'detail': 'Reviewer has been set to private.'}
        return Response(payload, status=status.HTTP_200_OK)

    def get_queryset(self):
        if self.is_get_method:
            return PublicReviewer.reviewers.all()
        return PublicReviewer.reviewers.filter(reviewer__owner=self.request.user)

    def get_serializer_context(self):
        return {'owner': self.request.user}

    def get_serializer_class(self):
        if self.is_get_method:
            return RetrievePublicReviewerSerializer
        return PublicReviewerSerializer


