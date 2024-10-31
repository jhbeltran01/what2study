from django.urls import path, include

from . import views

app_name = 'apis_reviewers'

urlpatterns = [
    path('<slug:reviewer_slug>/content/', include('apis.reviewer_content.urls')),
    path('public/', include([
        path('',
                views.PublicizeReviewerAPIView.as_view(),
                    name='publicize'),
        path('bookmark/',
                views.BookmarkedReviewerAPIView.as_view(),
                    name='bookmark'),
        path('<slug:slug>/',
             views.PublicizeReviewerAPIView.as_view(),
                name='publicize'),
        path('recently-viewed/add/',
             views.RecentViewedReviewerAPIView.as_view(),
                name='recent-viewed'),
    ])),
    path('',
            views.ReviewersAPIView.as_view(),
                name='reviewers'),
    path('<slug:slug>/',
            views.ReviewersAPIView.as_view(),
                name='single-reviewer'),
]