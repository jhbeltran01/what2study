from rest_framework import serializers

from apis.reviewers.services import unauthorized_user, is_already_public
from common.models import (
    Reviewer,
    PublicReviewer,
    RecentViewedPublicReviewer,
    BookmarkedPublicReviewer,
)

from django.utils.text import slugify

from apis.authentication.serializers import UserInfoSerializer


class ReviewerSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Reviewer
        fields = [
            'name',
            'owner',
            'description',
            'slug',
            'created_at',
            'updated_at',
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.pop('owner', None)

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
