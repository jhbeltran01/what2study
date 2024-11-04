from rest_framework import serializers

from apis.authentication.models import User


class SettingsUserInfoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'is_active',
            'password'
        ]
