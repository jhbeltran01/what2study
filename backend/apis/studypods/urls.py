from django.urls import path

from . import views

app_name = 'apis_studypods'

urlpatterns = [
    path('',
            views.StudyPodAPIView.as_view(),
                name='studypod'),
    path('<slug:slug>/',
            views.StudyPodAPIView.as_view(),
                name='studypod-slug'),
    path('get-encrypted-id/',
            views.StudyPodGenerateEncryptedUserID.as_view(),
                name='studypod-encrypted-id'),
]