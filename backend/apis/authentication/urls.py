from django.urls import path
from . import views

app_name = 'api_authentication'


urlpatterns = [
    path('login/', 
            views.LoginAPIView.as_view(), 
                name='login'),
    path('logout/', 
            views.LogoutAPIView.as_view(), 
                name='logout'),
    path('login/user-id/', 
            views.LoginUsingUserID.as_view(), 
                name='login-id'),
    path('authenticated-user-details/', 
            views.AuthenticatedUserDetail.as_view(),
                name='user-detail')
]
