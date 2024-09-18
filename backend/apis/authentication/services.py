from rest_framework.response import Response
from rest_framework_simplejwt.tokens import (
    AccessToken,
    RefreshToken
)
from rest_framework import status

from .models import User
from .serializers import UserInfoSerializer

class ResponseWithCookies:
    def __init__(self, user_id):
        self.user = User.objects.get(id=user_id)
        self.refresh_str = None
        self.access_str = ''
        self.response = Response(self._get_user_info(), status=status.HTTP_200_OK)

    def _get_user_info(self):
        return UserInfoSerializer(self.user).data

    def get(self):
        # set access refresh cookie
        self._add_cookie('refresh', self._get_refresh_token())
        # set access token cookie
        self._add_cookie('token', self._get_access_token())
        return self.response

    def _add_cookie(self, key, value):
        self.response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            max_age=60 * 24 * 60 * 60,
            samesite='None',
            secure=True,
        )

    def _get_refresh_token(self):
        self.refresh_str = str(RefreshToken.for_user(self.user))
        return self.refresh_str

    def _get_access_token(self):
        refresh = RefreshToken(self.refresh_str)
        return str(refresh.access_token)
