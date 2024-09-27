from django.urls import path

from . import consumers


urlpatterns = [
    path("<str:study_pod_slug>/",
                consumers.StudyPodConsumer.as_asgi()),
]