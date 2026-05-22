from django.urls import path
from .views import (
    NotificationListView,
    MarkReadView
)

urlpatterns = [
    path("list/",NotificationListView.as_view()),
    path("read/<int:pk>/",MarkReadView.as_view()),
]