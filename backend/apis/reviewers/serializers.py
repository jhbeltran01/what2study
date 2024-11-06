from rest_framework import serializers

from apis.reviewer_content.serializers import DefinitionSerializer
from apis.reviewers.services import unauthorized_user, is_already_public, remove_items_in_dictionary
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
    is_public = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reviewer
        fields = [
            'name',
            'owner',
            'description',
            'slug',
            'is_public',
            'titles',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.pop('owner', None)
        self.is_get_content = self.context.pop('is_get_content', False)
        self.is_partial = self.context.pop('is_partial', False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if self.is_partial:
            keys = ['name', 'owner', 'description', 'slug', 'created_at', 'updated_at']
            return remove_items_in_dictionary(representation, keys)

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
        if self.is_partial:
            return None
        return UserInfoSerializer(self.owner).data

    def get_titles(self, instance):
        if type(instance) is dict:
            return []

        titles = Title.titles.filter(reviewer=instance)
        return TitleSerializer(titles, many=True).data

    def get_is_public(self, instance):
        try:
            _ = instance.public
            return True
        except:
            return False

class PublicizeReviewerQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)
    is_public = serializers.BooleanField()


class PublicReviewerSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    description = serializers.SerializerMethodField(read_only=True)
    reviewer = serializers.SlugRelatedField(queryset=Reviewer.reviewers.all(), slug_field='slug')
    name = serializers.CharField(default='')
    is_bookmarked = serializers.SerializerMethodField(read_only=True)
    titles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PublicReviewer
        fields = [
            'reviewer',
            'name',
            'slug',
            'owner',
            'description',
            'is_bookmarked',
            'titles',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.pop('owner')
        self.is_get_content = self.context.pop('is_get_content', False)
        self.is_partial = self.context.pop('is_partial', False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if self.is_partial:
            keys = ['reviewer','name', 'owner', 'description', 'slug', 'created_at', 'updated_at', 'is_bookmarked']
            return remove_items_in_dictionary(representation, keys)

        if not self.is_get_content:
            representation.pop('titles', None)

        return representation

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

    def get_titles(self, instance):
        data = ReviewerSerializer(
            instance.reviewer,
            context={
                'is_get_content': True,
                'is_partial': True,
            }
        ).data
        return data.get('titles', [])


class RecentlyViewedQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)


class BookmarkedQueryParamSerializer(serializers.Serializer):
    reviewer = serializers.CharField(max_length=100)
    is_bookmarked = serializers.BooleanField(required=True)

    def validate_is_bookmarked(self, value):
        if self.initial_data.get('is_bookmarked', None) is None:
            raise serializers.ValidationError('This field is required')

        return value


class TitleSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField(read_only=True)
    is_in_order = serializers.SerializerMethodField(read_only=True)
    t_type = serializers.SerializerMethodField(read_only=True)
    type = serializers.CharField(required=False)
    is_in_enumeration = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Title
        fields = [
            'text',
            'type',
            't_type',
            'content',
            'slug',
            'is_in_order',
            'is_in_enumeration',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_enum_content = self.context.pop('is_enum_content', False)
        self.is_update = self.context.pop('is_update', False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.type != Title.Type.ENUMERATION:
            representation.pop('is_in_order', None)

        return representation

    def get_t_type(self, instance):
        return instance.get_type_display()

    def get_content(self, instance):
        if instance is None or self.is_enum_content or self.is_update:
            return []

        match instance.type:
            case Title.Type.DEFINITION | Title.Type.ENUMERATION_TITLE:
                definitions = instance.definitions.all()
                return DefinitionSerializer(definitions, many=True).data
            case Title.Type.ENUMERATION:
                enumeration_answers = instance.answers.all()
                return TitleSerializer(
                    enumeration_answers,
                    many=True,
                    context={'is_enum_content': True}
                ).data

    def get_is_in_order(self, instance):
        """Will only show when the title type is Enumeration"""
        if instance.type != Title.Type.ENUMERATION:
            return None

        enum_title = EnumerationTitle.titles.filter(title=instance).first()
        return enum_title.is_in_order

    def get_is_in_enumeration(self, instance):
        return instance.enum_title is not None