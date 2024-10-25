from rest_framework import serializers
from common.models import Reviewer

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