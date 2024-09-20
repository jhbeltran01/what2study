from django.urls import re_path, path
from channels.routing import URLRouter
from asgi.studypod.urls import urlpatterns as studypod_urls


websocket_urlpatterns = [
    path("study-pod/", URLRouter(studypod_urls))
]