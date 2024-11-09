from django.contrib.auth.hashers import make_password
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework import status
from rest_framework.response import Response

from apis.authentication.models import User
from apis.settings.serializers import SettingsUserInfoSerializer


class UserInfoAPIView(
    UpdateModelMixin,
    GenericAPIView,
):
    serializer_class = SettingsUserInfoSerializer
    queryset = User.objects.all()

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.request.user.is_active = False
        self.request.user.save()
        return Response({'detail': 'Account has been deleted.'}, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        password = serializer.validated_data.pop('password', None)
        will_update_password = password is not None

        if will_update_password:
            serializer.validated_data['password'] = make_password(password)

        serializer.save()

    def get_object(self):
        return self.request.user