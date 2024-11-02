from rest_framework import serializers

from common.models import (
    Reviewer,
    Title,
    Definition,
)


class ReviewerContentQueryParamSerializer(serializers.Serializer):
    reviewer_slug = serializers.CharField(max_length=50)
    title_slug = serializers.CharField(max_length=50, allow_null=True)
    enumeration_title_slug = serializers.CharField(max_length=50, default='')
    is_definition = serializers.BooleanField(required=False)
    reviewer = serializers.SerializerMethodField(read_only=True)
    title = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.valid_title_types = [Title.Type.DEFINITION, Title.Type.ENUMERATION_TITLE]
        self.title_slug_is_needed = True
        self.content_slug_is_only_needed = False
        self.is_definition_is_needed = False

        if self.context is not None:
            self.valid_title_types = self.context.pop('valid_title_types')
            self.title_slug_is_needed = self.context.pop('title_slug_is_needed', True)
            self.is_definition_is_needed = self.context.get('is_definition_is_needed', False)
            self.content_slug_is_only_needed = self.context.get('content_slug_is_only_needed', False)

        self.reviewer = None
        self.title = None
        self.definition = None
        self.enum_title = None

    def validate_reviewer_slug(self, value):
        if self.content_slug_is_only_needed:
            return None

        self.reviewer = Reviewer.reviewers.filter(slug=value).first()

        if self.reviewer is None:
            raise serializers.ValidationError('Reviewer not found.')

        return value

    def validate_title_slug(self, value):
        if self.content_slug_is_only_needed:
            return None

        if not self.title_slug_is_needed:
            return value

        self.title = Title.titles.filter(slug=value).first()

        if self.title is None:
            raise serializers.ValidationError('Title not found.')

        if not self.title.type in self.valid_title_types:
            raise serializers.ValidationError('Invalid title type.')

        return value

    def validate_enumeration_title_slug(self, value):
        if not self.content_slug_is_only_needed:
            return value

        if value is None or value == '':
            raise serializers.ValidationError('This field is required')

        self.enum_title = Title.titles.filter(slug=value).first()

        if self.enum_title is None:
            raise serializers.ValidationError('Enumeration Title not found.')

        return value

    def get_reviewer(self, instance):
        return self.reviewer

    def get_title(self, instance):
        if self.content_slug_is_only_needed:
            return self.enum_title
        return self.title


class DefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definition
        fields = [
            'text',
            'slug',
            'created_at',
            'updated_at'
        ]

    def validate_text(self, value):
        return value.strip()


class AddReviewerContentSerializer(serializers.Serializer):
    content = serializers.CharField()


class ReviewerContentSerializer(serializers.Serializer):
    content = serializers.CharField()