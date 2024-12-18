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
    path('<slug:subject>/reviewers/',
            views.SubjectReviewerAPIView.as_view(),
                name='reviewers'),
    path('<slug:subject>/notes/',
            views.SubjectNoteAPIView.as_view(),
                name='notes'),
    path('<slug:subject>/<slug:reviewer>/',
            views.SubjectReviewerAPIView.as_view(),
                name='single-reviewer'),
    path('<slug:subject>/note/<slug:note>/',
            views.SubjectNoteAPIView.as_view(),
                name='notes'),
]