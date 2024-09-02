from django.urls import path

from . import views

app_name = 'pages'

urlpatterns = [
    path("", views.home),
    path("logout", views.logout_view),

]