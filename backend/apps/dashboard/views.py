from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db.models import Sum

from apps.medicines.models import Medicine
from apps.orders.models import Order


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_data(request):

    user = request.user

    response = {
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

    if user.role == "admin":

        response["dashboard"] = {
            "pending_users": True,
            "approve_users": True,
            "reject_users": True,
            "all_medicines": True,
            "all_orders": True,
            "contact_messages": True,
            "analytics": True
        }

    elif user.role == "supplier":

        total_medicines = Medicine.objects.filter(
            supplier=user
        ).count()

        low_stock_count = Medicine.objects.filter(
            supplier=user,
            stock__lt=10
        ).count()

        pending_orders = Order.objects.filter(
            medicine__supplier=user,
            status="pending"
        ).count()

        revenue = (
            Order.objects.filter(
                medicine__supplier=user,
                status="delivered"
            ).aggregate(
                total=Sum("total_price")
            )["total"] or 0
        )

        response["dashboard"] = {
            "add_medicine": True,
            "update_medicine": True,
            "delete_medicine": True,
            "medicine_list": True,
            "low_stock": True,
            "supplier_orders": True
        }

        response["stats"] = {
            "total_medicines": total_medicines,
            "low_stock_count": low_stock_count,
            "pending_orders": pending_orders,
            "revenue": revenue
        }

    elif user.role == "buyer":

        response["dashboard"] = {
            "medicine_list": True,
            "place_order": True,
            "order_history": True,
            "cancel_order": True
        }

    return Response(response)