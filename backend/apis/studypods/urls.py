from django.urls import path

from . import views

app_name = 'apis_studypods'

urlpatterns = [
    path('',
            views.StudyPodAPIView.as_view(),
                name='studypod'),
    path('<slug:slug>/',
            views.StudyPodAPIView.as_view(),
                name='slug'),
    path('join/room/',
            views.JoinStudypodAPIView.as_view(),
                name='join'),
    path('get-encrypted-id/',
            views.StudyPodGenerateEncryptedUserIDAPIView.as_view(),
                name='studypod-encrypted-id'),
]