from django.urls import path

from . import views


app_name = 'apis_subjects'

urlpatterns = [
    path('',
            views.SubjectAPIView.as_view(),
                name='subjects'),
    path('<slug:slug>/',
            views.SubjectAPIView.as_view(),
                name='subjects'),
]