from rest_framework import serializers
from .models import User


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
            'last_login'
        ]
