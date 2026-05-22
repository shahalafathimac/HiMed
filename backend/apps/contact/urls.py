from django.urls import path

from .views import (
    ContactCreateView,
    ContactListView,
    ReplyMessageView,
    ResolveMessageView,
)

urlpatterns = [
    path('create/',ContactCreateView.as_view()),
    path('messages/',ContactListView.as_view()),
    path('reply/<int:pk>/',ReplyMessageView.as_view()),
    path('resolve/<int:pk>/',ResolveMessageView.as_view()),
]