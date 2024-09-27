from django.urls import path

from . import views

app_name = 'apis_questions'

urlpatterns = [
    path('generate/',
            views.GenerateQuestion.as_view(),
                name='generate-question'),
]