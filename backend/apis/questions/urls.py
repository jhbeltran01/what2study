from django.urls import path

from . import views

app_name = 'apis_questions'

urlpatterns = [
    path('generate/',
            views.GenerateQuestion.as_view(),
                name='generate-question'),
    path('check-answer/',
            views.CheckAnswerAPIView.as_view(),
                name='check-answer'),
    path('reset/<slug:reviewer>/',
            views.ResetQuestionsAPIView.as_view(),
                name='reset')
]