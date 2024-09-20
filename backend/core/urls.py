"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('apis/auth/', include('apis.authentication.urls')),
    path('apis/reviewers/', include('apis.reviewers.urls')),
    path('apis/studypods/', include('apis.studypods.urls')),
    path('apis/notes/', include('apis.notes.urls')),
    path('apis/todo/', include('apis.todo.urls')),
    path('apis/questions/', include('apis.questions.urls')),
    path('', include('apps.pages.urls')),
    re_path(r'^app/.*', include('apps.spa.urls')),
    path("accounts/", include("allauth.urls")),
]
