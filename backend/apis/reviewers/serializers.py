from rest_framework import serializers

from apis.reviewers.services import unauthorized_user, is_already_public
from common.models import (
    Reviewer,
    PublicReviewer,
    BookmarkedPublicReviewer, Title, Definition, EnumerationTitle,
)

from django.utils.text import slugify

from apis.authentication.serializers import UserInfoSerializer


class ReviewerSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    titles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reviewer
        fields = [
            'name',
            'owner',
            'description',
            'slug',
            'titles',
            'created_at',
            'updated_at',
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.pop('owner', None)
        self.is_get_content = self.context.pop('is_get_content', False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not self.is_get_content:
            representation.pop('titles', None)
        return representation

    def create(self, validated_data):
        validated_data.pop('files', None)
        return super().create(validated_data)
    
    def validate_name(self, value):
        slug = slugify('{}-{}'.format(value, self.owner.id))
        reviewer_exists = Reviewer.reviewers.filter(slug=slug).first() is not None

        if reviewer_exists:
            raise serializers.ValidationError("Reviewer exists.")
        return value
    
    def get_owner(self, instance):
        return UserInfoSerializer(instance.owner).data

    def get_titles(self, instance):
        titles = Title.titles.filter(reviewer=instance, enum_title=None)
        return InlineTitleSerializer(titles, many=True).data


class PublicizeReviewerQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)
    is_public = serializers.BooleanField()


class PublicReviewerSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    description = serializers.SerializerMethodField(read_only=True)
    reviewer = serializers.SlugRelatedField(queryset=Reviewer.reviewers.all(), slug_field='slug')
    name = serializers.CharField(default='')
    is_bookmarked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PublicReviewer
        fields = [
            'reviewer',
            'name',
            'slug',
            'owner',
            'description',
            'is_bookmarked',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.get('owner')

    def validate_name(self, value):
        reviewer_slug = self.initial_data['reviewer']
        reviewer = Reviewer.reviewers.filter(slug=reviewer_slug).first()

        if value == '' and 'reviewer' in self.initial_data and reviewer:
            value = reviewer.name

        unauthorized_user(reviewer, self.owner.id)
        is_already_public(value, self.owner.id, reviewer=reviewer)

        return value

    def get_owner(self, instance):
        return UserInfoSerializer(instance.reviewer.owner).data

    def get_description(self, instance):
        return instance.reviewer.description

    def get_is_bookmarked(self, instance):
        bookmarked_reviewer = BookmarkedPublicReviewer.reviewers.filter(
            public_reviewer=instance,
            owner=self.owner,
        ).first()
        return bookmarked_reviewer is not None


class RecentlyViewedQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)


class BookmarkedQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)
    is_bookmarked = serializers.BooleanField(required=True)

    def validate_is_bookmarked(self, value):
        if self.initial_data.get('is_bookmarked', None) is None:
            raise serializers.ValidationError('This field is required')

        return value


class InlineTitleSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField(read_only=True)
    is_in_order = serializers.SerializerMethodField(read_only=True)
    type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Title
        fields = [
            'text',
            'type',
            'content',
            'is_in_order',
            'created_at',
            'updated_at',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.type != Title.Type.ENUMERATION:
            representation.pop('is_in_order', None)

        return representation

    def get_type(self, instance):
        return instance.get_type_display()

    def get_content(self, instance):
        match instance.type:
            case Title.Type.DEFINITION | Title.Type.ENUMERATION_TITLE:
                definitions = instance.definitions.all()
                return DefinitionSerializer(definitions, many=True).data
            case Title.Type.ENUMERATION:
                enumeration_answers = instance.answers.all()
                return InlineTitleSerializer(enumeration_answers, many=True).data

    def get_is_in_order(self, instance):
        """Will only show when the title type is Enumeration"""
        if instance.type != Title.Type.ENUMERATION:
            return None

        enum_title = EnumerationTitle.titles.filter(title=instance).first()
        return enum_title.is_in_order


class DefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definition
        fields = [
            'text',
            'created_at',
            'updated_at'
        ]