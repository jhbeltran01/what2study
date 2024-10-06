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
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.slug = ''
        self.is_get_note = ''
        self.files = ''

    def dispatch(self, request, *args, **kwargs):
        self.slug = kwargs.get('slug')
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        self.files = request.FILES.getlist('files')
        return self.create(request, *args, **kwargs)
    
    
    
    def get(self, request, *args, **kwargs):
        self.is_get_note = self.slug is not None

        if self.is_get_note:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def get_queryset(self):
        return Note.note.filter(owner=self.request.user)
    
    def get_object(self):
        return Note.note.get(slug=self.slug)
    
    def get_serializer_context(self):
        return {'owner': self.request.user}
