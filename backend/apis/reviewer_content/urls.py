from django.urls import path, include

from . import views

app_name = 'content'

urlpatterns = [
    path('titles/',
            views.TitleAPIView.as_view(),
                name='single-title'),
    path('titles/<slug:slug>/',
            views.TitleAPIView.as_view(),
                name='single-title'),
    path('titles/<slug:title_slug>/', include([
        path('definition/',
             views.DefinitionAPIView.as_view(),
             name='definition-title'),
        path('definition/<slug:slug>/',
             views.DefinitionAPIView.as_view(),
             name='definition-title'),
        path('enumeration-titles/',
             views.EnumerationTitleAPIView.as_view(),
             name='enum-title'),
        path('enumeration-titles/<slug:slug>/',
             views.EnumerationTitleAPIView.as_view(),
             name='single-enum-title')
    ])),
]