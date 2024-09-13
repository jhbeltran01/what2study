import json

from rest_framework.serializers import ModelSerializer

from common.models import StudyPod


class StudyPodSerializer(ModelSerializer):
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