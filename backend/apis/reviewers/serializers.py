from rest_framework import serializers
from common.models import Reviewer


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
        if self.context['owner'] is not None:
                self.owner = self.context['owner']
    
    def validate_name(self, value):
        reviewer_exists = Reviewer.objects.filter(slug='{}-{}'.format(value, self.owner)).first() is not None

        if reviewer_exists:
            raise serializers.ValidationError("A reviewer with this slug already exists.")
        return value
