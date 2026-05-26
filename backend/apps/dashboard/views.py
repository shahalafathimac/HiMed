from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db.models import Sum
from django.utils import timezone

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

        active_statuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery"
        ]

        pending_delivery_statuses = [
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery"
        ]

        now = timezone.now()
        month_start = now.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )

        buyer_orders = Order.objects.filter(
            buyer=user
        )

        active_orders = buyer_orders.filter(
            status__in=active_statuses
        ).count()

        total_purchases_this_month = (
            buyer_orders.exclude(
                status="cancelled"
            ).filter(
                created_at__gte=month_start
            ).aggregate(
                total=Sum("total_price")
            )["total"] or 0
        )

        available_medicines = Medicine.objects.filter(
            stock__gt=0
        ).count()

        low_stock_alerts = Medicine.objects.filter(
            stock__gt=0,
            stock__lt=10
        ).count()

        pending_deliveries = buyer_orders.filter(
            status__in=pending_delivery_statuses
        ).count()

        saved_suppliers = buyer_orders.values(
            "medicine__supplier"
        ).distinct().count()

        status_counts = {
            "pending": buyer_orders.filter(status="pending").count(),
            "processing": buyer_orders.filter(status__in=["confirmed", "processing"]).count(),
            "shipped": buyer_orders.filter(status="shipped").count(),
            "out_for_delivery": buyer_orders.filter(status="out_for_delivery").count(),
        }

        response["dashboard"] = {
            "medicine_list": True,
            "place_order": True,
            "order_history": True,
            "cancel_order": True
        }

        response["stats"] = {
            "active_orders": active_orders,
            "total_purchases_this_month": total_purchases_this_month,
            "available_medicines": available_medicines,
            "low_stock_alerts": low_stock_alerts,
            "pending_deliveries": pending_deliveries,
            "saved_suppliers": saved_suppliers,
            "status_counts": status_counts
        }

    return Response(response)
