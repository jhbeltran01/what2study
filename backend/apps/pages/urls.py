from django.urls import path
from apps.pages.views import check_user_exists

from . import views

app_name = 'pages'

urlpatterns = [
    path('', views.LandingPageView.as_view(), name='landing-page'),
    path("logout", views.logout_view),
    path('dashboard/', views.DashboardPageView.as_view(), name='dashboard'),
    path('reviewer/', check_user_exists),
]