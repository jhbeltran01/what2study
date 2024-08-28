from django.urls import path

from . import views

app_name = 'spa'

urlpatterns = [
    path('', 
            views.SingePageApp.as_view(), 
                name='spa'),
]