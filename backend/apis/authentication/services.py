import jwt
from datetime import datetime

from django.utils import timezone
from django.conf import settings

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


class JWTTokens:
    def __init__(self, request=None, access_token='', refresh_token=''):
        self.request = request
        self.access_token = access_token
        self.refresh_token = refresh_token

    def check_for_tokens_expirations(self):
        if self.access_token is not None:
            # get new access token if it is expired
            if self._access_token_is_expired(self.access_token):
                # get new refresh token if it is expired
                if self._refresh_token_is_expired(self.refresh_token):
                    self.refresh_token = self._get_new_refresh_token(self.access_token)

                self.access_token = self._get_new_access_token(self.refresh_token)

    @staticmethod
    def _access_token_is_expired(token):
        try:
            access_token = AccessToken(token)
            current_date = timezone.now()
            return access_token['exp'] < current_date.timestamp()
        except:
            return True

    @staticmethod
    def _refresh_token_is_expired(token):
        try:
            refresh_token = RefreshToken(token)
            payload = refresh_token.payload
            exp_timestamp = payload['exp']
            exp_date = datetime.fromtimestamp(exp_timestamp)
            curr_date = timezone.now()

            return curr_date > exp_date
        except:
            return True

    def _get_new_refresh_token(self, token):
        refresh = RefreshToken.for_user(self._get_user(token))
        return str(refresh)

    @staticmethod
    def _get_user(token):
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms='HS256',
            options={"verify_signature": False}
        )
        return User.objects.get(id=payload['user_id'])

    @staticmethod
    def _get_new_access_token(refresh_token):
        refresh = RefreshToken(refresh_token)
        return str(refresh.access_token)

    def get_request(self):
        self.request.META['HTTP_AUTHORIZATION'] = 'Bearer {}'.format(self.access_token)

    @property
    def user(self):
        return self._get_user(self.refresh_token)