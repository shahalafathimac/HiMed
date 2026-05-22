from apps.medicines.models import Medicine
from .services import create_notification


def check_low_stock():

    medicines = Medicine.objects.filter(
        stock__lt=10
    )

    for medicine in medicines:

        create_notification(

            medicine.supplier,

            "Low Stock Alert",

            f"{medicine.name} stock is below 10",

            "low_stock"
        )