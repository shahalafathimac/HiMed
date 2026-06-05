from django.urls import path
from .views import (
    NotificationListView,
    MarkReadView,
    UnreadCountView,
)

urlpatterns = [
    path("list/", NotificationListView.as_view()),
    path("read/<int:pk>/", MarkReadView.as_view()),
    path("unread-count/", UnreadCountView.as_view()),
]