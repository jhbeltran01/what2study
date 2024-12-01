# [STUD-015] To-Do API {views.py}
from rest_framework.exceptions import ValidationError, NotFound
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
from .serializers import TodoSerializer, TodoItemSerializer
from common.models import Todo, TodoItem


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
    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    # Filters Todos to only those owned by the current user.
    def get_queryset(self):
        return Todo.todos.filter(owner=self.request.user)
    
    # Retrieves a specific Todo by slug.
    def get_object(self):
        return Todo.todos.get(slug=self.slug)
    
    # Passes the current user as owner to the serializer.
    def get_serializer_context(self):
        return {'owner': self.request.user}


class TodoItemAPIView(
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    GenericAPIView
):
    serializer_class = TodoItemSerializer
    lookup_field = 'slug'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.todo = None
        self.todo_item = None

    def dispatch(self, request, *args, **kwargs):
        kwargs['slug'] = kwargs.get('item', None)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        self._set_todo(kwargs)

        if kwargs['slug'] is not None:
            return super().retrieve(request, *args, **kwargs)

        return super().list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self._set_todo(kwargs)
        return super().create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self._set_todo(kwargs)
        return super().destroy(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        self._set_todo(kwargs)
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            todo=self.todo,
        )

    def get_queryset(self):
        return TodoItem.items.filter(
            owner=self.request.user,
            todo=self.todo,
        )

    def _set_todo(self, kwargs):
        self.todo = Todo.todos.filter(slug=kwargs.get('todo', None)).first()
        if self.todo is None:
            raise NotFound('Todo is not found.')
