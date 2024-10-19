# [STUD-015] To-Do API {views.py}
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
from .serializers import TodoSerializer
from common.models import Todo

class TodoAPIView(
    CreateModelMixin,  # Mixin to handle object creation
    ListModelMixin,    # Mixin to handle listing of objects
    RetrieveModelMixin, # Mixin to handle retrieval of a specific object
    UpdateModelMixin,  # Mixin to handle updating of an object
    DestroyModelMixin, # Mixin to handle deleting of an object
    GenericAPIView    # Base class for defining API views
):
    serializer_class = TodoSerializer # Specifies the serializer to use for handling the request and response data
    lookup_field = 'slug'  # Uses the 'slug' field to look up individual Todo items
    parser_classes = (MultiPartParser, FormParser)  # Specifies parsers to handle file uploads and form data

    #  Initializes the view and tracks slug, is_get_note, and files.
    def __init__(self, *args, **kwargs): 
        super().__init__(*args, **kwargs)  
        self.slug = ''  
        self.is_get_note = ''  
        self.files = ''

    # Retrieves the slug from the URL before processing the request.
    def dispatch(self, request, *args, **kwargs): 
        self.slug = kwargs.get('slug')  
        return super().dispatch(request, *args, **kwargs) 

    # Handles file uploads and creates a new Todo.
    def post(self, request, *args, **kwargs):
        self.files = request.FILES.getlist('files')  
        return self.create(request, *args, **kwargs)
    
    # Retrieves a single Todo if a slug is provided; otherwise, lists all Todos.
    def get(self, request, *args, **kwargs):
        self.is_get_note = self.slug is not None
        
        # If a slug is provided, retrieve a single Todo, otherwise list all Todos
        if self.is_get_note:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    # Deletes a Todo based on the slug.
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs) 
    
    # Updates an existing Todo.
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    # Filters Todos to only those owned by the current user.
    def get_queryset(self):
        return Todo.todo.filter(owner=self.request.user)
    
    # Retrieves a specific Todo by slug.
    def get_object(self):
        return Todo.todo.get(slug=self.slug)
    
    # Passes the current user as owner to the serializer.
    def get_serializer_context(self):
        return {'owner': self.request.user}
