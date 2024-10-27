from django.urls import path

from . import views

app_name = 'apis_studypods'

urlpatterns = [
    path('',
            views.StudyPodAPIView.as_view(),
                name='studypod'),
    path('get-encrypted-id/',
            views.StudyPodGenerateEncryptedUserIDAPIView.as_view(),
                name='studypod-encrypted-id'),
    path('join/',
            views.JoinStudypodAPIView.as_view(),
                name='join'),
    # for creating a reviewer and fetching the list of reviewers
    # on the studypod
    path('<slug:studypod_slug>/reviewers/',
            views.StudypodReviewersAPIView.as_view(),
                name='reviewer'),
    # for updating, deleting and
    # fetching a single studypod reviewer
    path('reviewers/<slug:reviewer_slug>/',
            views.StudypodReviewersAPIView.as_view(),
                name='single-reviewer'),
    path('<slug:slug>/',
            views.StudyPodAPIView.as_view(),
                name='slug'),
    path('<slug:slug>/leave/',
            views.LeaveStudypodAPIView.as_view(),
                name='leave'),
]