from rest_framework import serializers

from common.models import (
    Reviewer,
    Title,
    Definition,
)


class ReviewerContentQueryParamSerializer(serializers.Serializer):
    reviewer_slug = serializers.CharField(max_length=50)
    title_slug = serializers.CharField(max_length=50, allow_null=True)
    reviewer = serializers.SerializerMethodField(read_only=True)
    title = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.valid_title_types = [Title.Type.DEFINITION, Title.Type.ENUMERATION_TITLE]
        self.title_slug_is_needed = True

        if self.context is not None:
            self.valid_title_types = self.context.pop('valid_title_types')
            self.title_slug_is_needed = self.context.pop('title_slug_is_needed', True)

        self.reviewer = None
        self.title = None
        self.definition = None

    def validate_reviewer_slug(self, value):
        self.reviewer = Reviewer.reviewers.filter(slug=value).first()

        if self.reviewer is None:
            raise serializers.ValidationError('Reviewer not found.')

        return value

    def validate_title_slug(self, value):
        if not self.title_slug_is_needed:
            return value

        self.title = Title.titles.filter(slug=value).first()

        if self.title is None:
            raise serializers.ValidationError('Title not found.')

        if not self.title.type in self.valid_title_types:
            raise serializers.ValidationError('Invalid title type.')

        return value

    def get_reviewer(self, instance):
        return self.reviewer

    def get_title(self, instance):
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