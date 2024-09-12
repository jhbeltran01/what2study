from django.urls import path
from . import views

app_name = 'apis_reviewers'

urlpatterns = [
    path('', views.ReviewersAPIView.as_view(), name='reviewers'),
    path('<slug:slug>/', views.ReviewersAPIView.as_view(), name='single-reviewer'),
]