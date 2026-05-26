from django.urls import path
from .views import (
    PlaceOrderView,
    OrderHistoryView,
    OrderStatusView,
    CancelOrderView,
    SupplierOrdersView,
    UpdateOrderStatusView,
    AdminOrdersView,
    CartView,
    AddCartItemView,
    UpdateCartItemView,
    RemoveCartItemView,
    CheckoutCartView
)

urlpatterns = [
    path("place/",PlaceOrderView.as_view()),
    path("history/",OrderHistoryView.as_view()),
    path("status/<int:pk>/",OrderStatusView.as_view()),
    path("cancel/<int:pk>/",CancelOrderView.as_view()),
    path("supplier-orders/",SupplierOrdersView.as_view()),
    path("update-status/<int:pk>/",UpdateOrderStatusView.as_view()),
    path("admin-orders/",AdminOrdersView.as_view()),
    path("cart/",CartView.as_view()),
    path("cart/add/",AddCartItemView.as_view()),
    path("cart/update/<int:pk>/",UpdateCartItemView.as_view()),
    path("cart/remove/<int:pk>/",RemoveCartItemView.as_view()),
    path("cart/checkout/",CheckoutCartView.as_view()),
]
