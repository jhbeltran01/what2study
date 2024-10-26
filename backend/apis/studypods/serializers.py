from rest_framework import serializers

from django.utils.text import slugify

from apis.authentication.serializers import UserInfoSerializer
from common.models import StudyPod


class StudyPodSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudyPod
        fields = [
            'id',
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
        return UserInfoSerializer(self.owner).data


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