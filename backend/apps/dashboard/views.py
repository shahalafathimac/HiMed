from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from apps.medicines.models import Medicine
from apps.orders.models import Order
from apps.accounts.models import Account
from apps.accounts.permissions import IsAdmin


def _pct_change(current, previous):
    if previous > 0:
        return round(((current - previous) / previous) * 100, 1)
    return 100.0 if current > 0 else 0.0


def _month_range(dt):
    start = dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return start


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_data(request):

    user = request.user

    response = {
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

    if user.is_superuser or user.role == "admin":

        now = timezone.now()
        cur_start = _month_range(now)
        prev_start = _month_range(cur_start - timedelta(days=1))

        # Total Users
        approved_users = Account.objects.filter(is_approved=True, is_superuser=False)
        total_users = approved_users.count()
        users_cur = approved_users.filter(date_joined__gte=cur_start).count()
        users_prev = approved_users.filter(date_joined__gte=prev_start, date_joined__lt=cur_start).count()

        # Total Medicines
        total_medicines = Medicine.objects.count()
        med_cur = Medicine.objects.filter(created_at__gte=cur_start).count()
        med_prev = Medicine.objects.filter(created_at__gte=prev_start, created_at__lt=cur_start).count()

        # Total Orders
        total_orders = Order.objects.count()
        ord_cur = Order.objects.filter(created_at__gte=cur_start).count()
        ord_prev = Order.objects.filter(created_at__gte=prev_start, created_at__lt=cur_start).count()

        # Platform Revenue
        delivered = Order.objects.filter(status="delivered")
        platform_revenue = delivered.aggregate(total=Sum("total_price"))["total"] or 0
        rev_cur = delivered.filter(created_at__gte=cur_start).aggregate(total=Sum("total_price"))["total"] or 0
        rev_prev = delivered.filter(created_at__gte=prev_start, created_at__lt=cur_start).aggregate(total=Sum("total_price"))["total"] or 0

        response["dashboard"] = {
            "pending_users": True,
            "approve_users": True,
            "reject_users": True,
            "all_medicines": True,
            "all_orders": True,
            "contact_messages": True,
            "analytics": True
        }

        response["stats"] = {
            "total_users": total_users,
            "total_users_change": _pct_change(users_cur, users_prev),
            "total_medicines": total_medicines,
            "total_medicines_change": _pct_change(med_cur, med_prev),
            "total_orders": total_orders,
            "total_orders_change": _pct_change(ord_cur, ord_prev),
            "platform_revenue": float(platform_revenue),
            "platform_revenue_change": _pct_change(float(rev_cur), float(rev_prev)),
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


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def revenue_overview(request):
    year = timezone.now().year
    monthly = (
        Order.objects
        .filter(status="delivered", created_at__year=year)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(total=Sum("total_price"))
        .order_by("month")
    )
    data = {m["month"].month: float(m["total"]) for m in monthly}
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    result = [{"name": m, "total": data.get(i+1, 0)} for i, m in enumerate(months)]
    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def order_trends(request):
    year = timezone.now().year
    monthly = (
        Order.objects
        .filter(created_at__year=year)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(total=Count("id"))
        .order_by("month")
    )
    data = {m["month"].month: m["total"] for m in monthly}
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    result = [{"name": m, "total": data.get(i+1, 0)} for i, m in enumerate(months)]
    return Response(result)
