import jwt
from datetime import datetime

from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import (
    AccessToken,
    RefreshToken
)

from .models import User


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('token')

        if access_token is not None:
            # get new access token if it is expired
            if self._access_token_is_expired(access_token):
                refresh_token = request.COOKIES.get('refresh')

                # get new refresh token if it is expired
                if self._refresh_token_is_expired(refresh_token):
                    refresh_token = self._get_new_refresh_token(access_token)

                access_token = self._get_new_access_token(refresh_token)

            auth = 'Bearer {}'.format(access_token)
            request.META['HTTP_AUTHORIZATION'] = auth

        return super().authenticate(request)

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
            verify=False
        )
        return User.objects.get(id=payload['user_id'])

    @staticmethod
    def _get_new_access_token(refresh_token):
        refresh = RefreshToken(refresh_token)
        return str(refresh.access_token)
