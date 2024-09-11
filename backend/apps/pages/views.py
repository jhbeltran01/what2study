from django.shortcuts import render
from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth import logout
import posixpath
from pathlib import Path

from django.utils._os import safe_join
from django.views.static import serve as static_serve

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


class LandingPageView(TemplateView):
    template_name = 'pages/landing-page.html'

def logout_view(request):
    logout(request)
    return redirect("/")
def home(request):
    return render(request, "pages/home.html")

def logout_view(request):
    logout(request)
    return redirect("/")

def serve_react(request, path, document_root=None):
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    if fullpath.is_file():
        return static_serve(request, path, document_root)
    else:
        return static_serve(request, "index.html", document_root)


class dashboard(TemplateView):
    print("efhlwknschi")
    template_name = 'dashboard'
    def get(self, request):
        return render(request, 'pages/dashboard.html')
    
def check_user_exists(request):
    username_or_email = request.data.get('username_or_email')

    if User.objects.filter(username=username_or_email).exists() or User.objects.filter(email=username_or_email).exists():
        return Response({'exists': True}, status=status.HTTP_200_OK)
    else:
        return Response({'exists': False}, status=status.HTTP_200_OK)