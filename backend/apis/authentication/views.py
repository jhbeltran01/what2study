import jwt

from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import User
from .serializers import UserInfoSerializer


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView
from django.contrib.auth import logout

from .services import ResponseWithCookies
from ..studypods.services import decrypt_data

class LoginAPIView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as err:
            raise err

        self._blacklist_refresh_token(request.COOKIES.get('refresh'))

        return self._get_response(serializer)

    @staticmethod
    def _blacklist_refresh_token(refresh_token):
        """
        Blacklist refresh token when the user perform multiple request on login without requesting logout
        """
        if refresh_token is not None:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception as err:
                pass


    def _get_response(self, serializer):
        """
        Get Response with UserInfo as the data
        """
        access_token = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']

        self.response = Response(self._get_user_info(access_token), status=200)

        # set access token cookie
        self._add_cookie('token', access_token)
        # set access refresh cookie
        self._add_cookie('refresh', refresh_token)
        self._add_logged_in_cookie()

        return self.response

    def _get_user_info(self, token):
        return UserInfoSerializer(self._get_user(token)).data

    @staticmethod
    def _get_user(token):
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        return User.objects.get(id=payload['user_id'])

    def _add_cookie(self, key, value):
        self.response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            max_age=60 * 24 * 60 * 60,
            samesite='None',
            secure=True,
        )

    def _add_logged_in_cookie(self):
        # add is logged in cookie
        self.response.set_cookie(
            key='isLoggedIn',
            value=True,
            max_age=60 * 24 * 60 * 60,
            samesite='None',
            secure=True,
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        token = request.COOKIES.get('refresh')
        RefreshToken(token).blacklist()
        return self._get_response()

    @staticmethod
    def _get_response():
        response = Response({'message': 'Logout'}, status=200)
        response.delete_cookie('token')
        response.delete_cookie('refresh')
        response.delete_cookie('isLoggedIn')
        return response


class LogoutUserLoginUsingSessionAuthAPIView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'detail': 'User has been logged out.'})


class LoginUsingUserID(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        user_id = decrypt_data(request.data.get('data'))
        response = ResponseWithCookies(user_id)
        return response.get()


class AuthenticatedUserDetail(APIView):
    def get(self, request, *args, **kwargs):
        data = UserInfoSerializer(request.user).data
        return Response(data, status=status.HTTP_200_OK)
        
class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/accounts/google/login/callback/"
    client_class = OAuth2Client

class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return "redirect-url"

