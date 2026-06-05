from django.urls import path
from .views import dashboard_data, revenue_overview, order_trends

urlpatterns = [
    path("data/", dashboard_data),
    path("revenue-overview/", revenue_overview),
    path("order-trends/", order_trends),
]
