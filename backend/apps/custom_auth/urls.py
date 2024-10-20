from django.urls import path

from .views import *

app_name = 'custom_auth'

urlpatterns = [
    path('login/',
            CustomLoginView.as_view(),
                name='login'),
    path('create-account/',
            CreateAccount.as_view(),
                name='create-account')
]