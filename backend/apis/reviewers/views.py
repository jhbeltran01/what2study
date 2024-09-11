from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView

from .serializers import ReviewerSerializer
from common.models import Reviewer


class ReviewersAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    serializer_class = ReviewerSerializer
    lookup_field = 'slug'

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug')
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.is_get_reviewer = self.slug is not None

        if self.is_get_reviewer:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
    def get_queryset(self):
        return Reviewer.objects.filter(owner=self.request.user)
    
    def get_object(self):
        return Reviewer.objects.get(slug=self.slug)
    
    def get_serializer_context(self):
        # Add additional context if needed
        return {'owner': self.request.user}
