from django.urls import path

from . import views

app_name = 'pages'

urlpatterns = [
    path('', views.LandingPageView.as_view(), name='landing-page'),
    path("logout", views.logout_view),
    path('dashboard', views.dashboard.as_view(), name='dashboard'),
]