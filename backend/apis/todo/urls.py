from django.urls import path
from . import views

app_name = 'apis_todos'

urlpatterns = [
    path('', views.TodoAPIView.as_view(), name='todo'),
    path('<slug:slug>/', views.TodoAPIView.as_view(), name='single-todo'),
    path('<slug:todo>/items/',
            views.TodoItemAPIView.as_view(),
                name='todo-item'),
    path('<slug:todo>/<slug:item>/',
            views.TodoItemAPIView.as_view(),
                name='single-todo-item')
]