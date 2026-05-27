from django.urls import path

from .views import (
    CreateMedicineView,
    MedicineListView,
    UpdateMedicineView,
    DeleteMedicineView,
    low_stock_medicines,
    medicine_analytics,
    supplier_directory
)

urlpatterns = [

    path(
        "create/",
        CreateMedicineView.as_view()
    ),

    path(
        "list/",
        MedicineListView.as_view()
    ),

    path(
        "update/<int:pk>/",
        UpdateMedicineView.as_view()
    ),

    path(
        "delete/<int:pk>/",
        DeleteMedicineView.as_view()
    ),

    path(
        "low-stock/",
        low_stock_medicines
    ),

    path(
        "analytics/",
        medicine_analytics
    ),

    path(
        "suppliers/",
        supplier_directory
    ),

]
