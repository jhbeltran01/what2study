from django.utils.text import slugify
from rest_framework import serializers

from apis.authentication.serializers import UserInfoSerializer
from common.models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    number_of_reviewers = serializers.SerializerMethodField(read_only=True)
    number_of_notes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = [
            'owner',
            'name',
            'slug',
            'number_of_reviewers',
            'number_of_notes',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.get('owner', None)

    def validate_name(self, value):
        slug = slugify('{}-{}'.format(value, self.owner.id))

        if self.instance is not None and self.instance.slug == slug:
            return value

        subject_exists = Subject.subjects.filter(slug=slug).first() is not None

        if subject_exists:
            raise serializers.ValidationError("Subject exists.")
        return value

    def get_owner(self, instance):
        return UserInfoSerializer(instance.owner).data

    def get_number_of_reviewers(self, instance):
        return 0

    def get_number_of_notes(self, instance):
        return 0