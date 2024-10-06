import json
from rest_framework.permissions import AllowAny
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ReviewerSerializer
from common.models import Reviewer
from .services import Document
import requests

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
        self.slug = kwargs.get('slug')
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
        api_key = request.headers.get('x-api-key')
        print(api_key)
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

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def get_queryset(self):
        return Reviewer.reviewers.filter(owner=self.request.user)
    
    def get_object(self):
        return Reviewer.reviewers.get(slug=self.slug)
    
    def get_serializer_context(self):
        return {'owner': self.request.user}
