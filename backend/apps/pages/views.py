from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth import logout

from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status

from apps.custom_auth.services import redirect_to_app


class LandingPageView(TemplateView):
    template_name = 'pages/landing-page.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect_to_app()
        return super().dispatch(request, *args, **kwargs)


def logout_view(request):
    logout(request)
    return redirect("/")


def home(request):
    return render(request, "pages/home.html")


class DashboardPageView(TemplateView):
    template_name = 'pages/dashboard.html'


def check_user_exists(request):
    username_or_email = request.data.get('username_or_email')

    if User.objects.filter(username=username_or_email).exists() or User.objects.filter(email=username_or_email).exists():
        return Response({'exists': True}, status=status.HTTP_200_OK)
    else:
        return Response({'exists': False}, status=status.HTTP_200_OK)