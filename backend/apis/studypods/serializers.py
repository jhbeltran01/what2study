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
            'bg_color',
            'access_code',
            'members',
            'slug',
        ]

    def get_members(self, instance):
        print(instance.members)
        return instance.members