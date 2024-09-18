from django.urls import path
from . import views

app_name = 'apis_todo'

urlpatterns = [
    path('', views.TodoAPIView.as_view(), name='todo'),
    path('<slug:slug>/', views.TodoAPIView.as_view(), name='single-todo'),
]