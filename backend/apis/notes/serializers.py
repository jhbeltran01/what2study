from rest_framework import serializers

from apis.authentication.serializers import UserInfoSerializer
from common.models import Note
from django.utils.text import slugify

class NotesSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = [
            'name',
            'owner',
            'content',
            'slug',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context['owner']  
    
    def create(self, validated_data):
        validated_data['owner'] = self.owner
        return super().create(validated_data)
    
    def validate_name(self, value):
        slug = slugify('{}-{}'.format(value, self.owner.id))
        note_exists = Note.notes.filter(slug=slug).first() is not None

        if note_exists:
            raise serializers.ValidationError("Notes with the same name already exists.")
        return value

    def get_owner(self, instance):
        return UserInfoSerializer(instance.owner).data
