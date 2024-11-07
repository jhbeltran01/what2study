from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .serializers import NotesSerializer
from common.models import Note

class NotesAPIView(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    
    serializer_class = NotesSerializer
    lookup_field = 'slug' 

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = ''
        self.is_get_note = ''
        self.files = ''

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug')
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        self.is_get_note = self.slug is not None

        if self.is_get_note:
            return super().retrieve(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    
    def get_queryset(self):
        return Note.notes.filter(owner=self.request.user)
    
    def get_object(self):
        return Note.notes.get(
            slug=self.slug,
            owner=self.request.user
        )
    
    def get_serializer_context(self):
        return {'owner': self.request.user}
