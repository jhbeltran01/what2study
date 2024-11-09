from rest_framework import serializers

from django.utils.text import slugify

from apis.authentication.serializers import UserInfoSerializer
from apis.reviewers.serializers import ReviewerSerializer
from common.models import StudyPod, StudypodReviewer, Reviewer


class StudypodSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    access_code = serializers.CharField(required=False)

    class Meta:
        model = StudyPod
        fields = [
            'owner',
            'name',
            'size',
            'access_code',
            'members',
            'slug',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.pop('owner', None)

    def validate_name(self, value):
        slug = slugify('{}-{}'.format(value, self.owner.id))

        if self.instance is not None and self.instance.slug == slug:
            return value

        studypod_exists = StudyPod.groups.filter(slug=slug).first() is not None
        if studypod_exists:
            raise serializers.ValidationError("Studypod exists.")
        return value

    def get_owner(self, instance):
        return UserInfoSerializer(instance.owner).data


class StudypodAccessCodeSerializer(serializers.Serializer):
    access_code = serializers.CharField(max_length=12)
    studypod = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.studypod = None

    def validate_access_code(self, value):
        self.studypod = StudyPod.groups.filter(access_code=value).first()

        if self.studypod is None:
            raise serializers.ValidationError('Invalid access code.')

        if len(self.studypod.members) >= self.studypod.size:
            raise serializers.ValidationError('Maximum number of members reached.')

        return value

    def get_studypod(self, instance):
        return self.studypod


class StudypodReviewerSerializer(serializers.ModelSerializer):
    studypod_info = serializers.SerializerMethodField(read_only=True)
    reviewer_info = serializers.SerializerMethodField(read_only=True)
    studypod = serializers.SlugRelatedField(queryset=StudyPod.groups.all(), slug_field='slug')
    reviewer = serializers.SlugRelatedField(queryset=Reviewer.reviewers.all(), slug_field='slug')
    name = serializers.CharField(default='')

    class Meta:
        model = StudypodReviewer
        fields = [
            'studypod',
            'reviewer',
            'name',
            'studypod_info',
            'reviewer_info',
            'slug',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context.get('owner', None)

    def validate_name(self, value):
        if value == '' and self.instance is None:
            reviewer_slug = self.initial_data.get('reviewer')
            reviewer = Reviewer.reviewers.filter(slug=reviewer_slug).first()

            if reviewer is None:
                raise serializers.ValidationError('Reviewer is required')

            value = reviewer.name

        slug = slugify('{}-{}'.format(value, self.owner.id))
        reviewer = StudypodReviewer.reviewers.filter(slug=slug).first()
        reviewer_exists = reviewer is not None

        if self.instance is not None and slug == self.instance.slug:
            return value

        if reviewer_exists:
            raise serializers.ValidationError('Reviewer exists')

        return value

    def get_studypod_info(self, instance):
        return StudypodSerializer(instance.studypod).data

    def get_reviewer_info(self, instance):
        return ReviewerSerializer(instance.reviewer).data
