from django.urls import path
from .views import (
    PlaceOrderView,
    OrderHistoryView,
    OrderStatusView,
    CancelOrderView,
    SupplierOrdersView,
    UpdateOrderStatusView,
    AdminOrdersView
)

urlpatterns = [
    path("place/",PlaceOrderView.as_view()),
    path("history/",OrderHistoryView.as_view()),
    path("status/<int:pk>/",OrderStatusView.as_view()),
    path("cancel/<int:pk>/",CancelOrderView.as_view()),
    path("supplier-orders/",SupplierOrdersView.as_view()),
    path("update-status/<int:pk>/",UpdateOrderStatusView.as_view()),
    path("admin-orders/",AdminOrdersView.as_view()),
]