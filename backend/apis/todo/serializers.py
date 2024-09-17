from rest_framework import serializers
from common.models import Todo
from django.utils.text import slugify

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [
            'name',
            'owner',
            'slug',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context['owner']  
    
    def create(self, validated_data):
        validated_data.pop('files', None)
        validated_data['owner'] = self.owner
        return super().create(validated_data)
    
    def validate_name(self, value):
        slug = slugify('{}-{}'.format(value, self.owner.id))
        reviewer_exists = Todo.todo.filter(slug=slug).first() is not None

        if reviewer_exists:
            raise serializers.ValidationError("To Do with the same name already exists.")
        return value
