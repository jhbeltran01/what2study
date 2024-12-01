# [STUD-015] To-Do API {serializers.py}
from rest_framework import serializers  # Provides the tools for creating serializers

from apis.authentication.serializers import UserInfoSerializer
from common.models import Todo, TodoItem  # Importing the Todo model from the common.models file
from django.utils.text import slugify  # Used to create URL-friendly slugs from text


class TodoSerializer(serializers.ModelSerializer): # Defining a serializer class for the Todo model
    owner = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Todo  # Serializer for the Todo model
        fields = [
            'name',
            'owner',
            'slug',
            'items',
            'owner',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs): # Initializing the serializer with additional context, particularly to pass the owner
        super().__init__(*args, **kwargs)  # Calls the base class constructor
        self.owner = self.context['owner']  # Assigns the owner from the serializer's context

    
    def create(self, validated_data): # def create method to handle todo creation
        validated_data['owner'] = self.owner  # Sets the owner of the todo item to the passed context owner
        return super().create(validated_data)  # Calls the parent class create method

    
    def validate_name(self, value): # def validator for the 'name' field
        slug = slugify('{}-{}'.format(value, self.owner.id)) # Generates a unique slug by combining the name and owner ID
        reviewer_exists = Todo.todos.filter(slug=slug).first() is not None # Checks if a todo with the same slug already exists

        if reviewer_exists:
            raise serializers.ValidationError("To Do with the same name already exists.") # If a duplicate is found, raise a validation error
        
        return value # If no duplicate is found, return the validated name

    def get_owner(self, instance):
        return UserInfoSerializer(instance.owner).data

    def get_items(self, instance):
        todo_items = instance.items.all()
        return TodoItemSerializer(todo_items, many=True).data


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = [
            'text',
            'is_done',
            'slug',
            'created_at',
            'updated_at',
        ]
