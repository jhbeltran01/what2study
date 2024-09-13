from rest_framework import serializers
from common.models import Reviewer

from django.utils.text import slugify


class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = [
            'name',
            'owner',
            'slug',
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.owner = self.context['owner']

    def create(self, validated_data):
        validated_data.pop('files', None)
        return super().create(validated_data)
    
    def validate_name(self, value):
        return value
        slug = slugify('{}-{}'.format(value, self.owner.id))
        reviewer_exists = Reviewer.reviewers.filter(slug=slug).first() is not None

        if reviewer_exists:
            raise serializers.ValidationError("Reviewer exists.")
        return value