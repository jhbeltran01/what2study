from django.urls import path

from . import views

app_name = 'apis_settings'

urlpatterns = [
    path('user-info/<str:username>/',
            views.UserInfoAPIView.as_view(),
                name='user-info'),
]