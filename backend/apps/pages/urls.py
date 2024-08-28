from django.urls import path

from . import views

app_name = 'pages'

urlpatterns = [
    path('', 
            views.LandingPage.as_view(), 
                name='landing-page'),
]