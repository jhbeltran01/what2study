from django.urls import path
from . import views

app_name = 'apis_reviewers'

urlpatterns = [
    path('public/',
            views.PublicizeReviewerAPIView.as_view(),
                name='publicize'),
    path('public/<slug:slug>/',
            views.PublicizeReviewerAPIView.as_view(),
                name='publicize'),
    path('',
            views.ReviewersAPIView.as_view(),
                name='reviewers'),
    path('<slug:slug>/',
            views.ReviewersAPIView.as_view(),
                name='single-reviewer'),
]