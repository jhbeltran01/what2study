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
from .services import JWTTokens


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        jwt_auth = JWTTokens(
            request=request,
            access_token=request.COOKIES.get('token'),
            refresh_token=request.COOKIES.get('refresh')
        )
        jwt_auth.check_for_tokens_expirations()
        return super().authenticate(jwt_auth.get_request())
