from django.urls import path
from . import views

app_name = 'apis_notes'

urlpatterns = [
    path('', views.NotesAPIView.as_view(), name='notes'),
    path('<slug:slug>/', views.NotesAPIView.as_view(), name='single-note'),
]