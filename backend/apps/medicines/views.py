from django.shortcuts import render
from apps.accounts.permissions import IsSupplier
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Medicine
from .serializers import MedicineSerializer
from apps.orders.models import Order
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

User = get_user_model()

# Create your views here.
class CreateMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser
    ]

    def post(self, request):

        serializer = MedicineSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():

            serializer.save(
                supplier=request.user
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class MedicineListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        medicines = Medicine.objects.all()
        if request.user.role == "supplier":
            medicines = medicines.filter(
                supplier=request.user
            )

        serializer = MedicineSerializer(
            medicines,
            many=True,
            context={"request": request}
        )

        return Response(
            serializer.data
        )




class UpdateMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser
    ]

    def put(self, request, pk):

        try:

            medicine = Medicine.objects.get(
                id=pk,
                supplier=request.user
            )

        except Medicine.DoesNotExist:

            return Response({
                "message":
                "Medicine not found"
            })

        serializer = MedicineSerializer(
            medicine,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors
        )



class DeleteMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def delete(self, request, pk):

        try:

            medicine = Medicine.objects.get(
                id=pk,
                supplier=request.user
            )

        except Medicine.DoesNotExist:

            return Response({
                "message":
                "Medicine not found"
            })

        medicine.delete()

        return Response({
            "message":
            "Medicine deleted"
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def low_stock_medicines(request):

    medicines = Medicine.objects.filter(
        stock__lt=10
    )
    if request.user.role == "supplier":
        medicines = medicines.filter(
            supplier=request.user
        )

    serializer = MedicineSerializer(
        medicines,
        many=True
    )

    return Response(
        serializer.data
    )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def medicine_analytics(request):

    medicines = Medicine.objects.all()
    if request.user.role == "supplier":
        medicines = medicines.filter(
            supplier=request.user
        )

    total_medicines = medicines.count()

    low_stock = medicines.filter(
        stock__lt=10
    ).count()

    orders = Order.objects.all()
    if request.user.role == "supplier":
        orders = orders.filter(
            medicine__supplier=request.user
        )

    delivered_orders = orders.filter(
        status="delivered"
    )

    now = timezone.now()
    month_cursor = now.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    months = []
    for offset in range(5, -1, -1):
        year = month_cursor.year
        month = month_cursor.month - offset
        while month <= 0:
            month += 12
            year -= 1

        months.append(
            month_cursor.replace(
                year=year,
                month=month
            )
        )

    revenue_rows = delivered_orders.annotate(
        month=TruncMonth("created_at")
    ).values(
        "month"
    ).annotate(
        total=Sum("total_price")
    )

    order_rows = orders.annotate(
        month=TruncMonth("created_at")
    ).values(
        "month"
    ).annotate(
        total=Count("id")
    )

    revenue_by_month = {
        row["month"].strftime("%Y-%m"): row["total"]
        for row in revenue_rows
    }

    orders_by_month = {
        row["month"].strftime("%Y-%m"): row["total"]
        for row in order_rows
    }

    monthly_revenue = [
        {
            "name": month.strftime("%b"),
            "total": float(revenue_by_month.get(month.strftime("%Y-%m"), 0))
        }
        for month in months
    ]

    monthly_orders = [
        {
            "name": month.strftime("%b"),
            "total": orders_by_month.get(month.strftime("%Y-%m"), 0)
        }
        for month in months
    ]

    return Response({

        "total_medicines":
        total_medicines,

        "low_stock":
        low_stock,

        "monthly_revenue":
        monthly_revenue,

        "monthly_orders":
        monthly_orders

    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def supplier_directory(request):

    suppliers = User.objects.filter(
        role="supplier"
    ).order_by(
        "username"
    )

    data = []
    for supplier in suppliers:
        medicines = Medicine.objects.filter(
            supplier=supplier
        )

        serialized_medicines = MedicineSerializer(
            medicines[:3],
            many=True,
            context={"request": request}
        ).data

        data.append({
            "id": supplier.id,
            "name": supplier.username,
            "email": supplier.email,
            "medicine_count": medicines.count(),
            "total_stock": sum(medicine.stock for medicine in medicines),
            "low_stock_count": medicines.filter(
                stock__gt=0,
                stock__lt=10
            ).count(),
            "medicines": serialized_medicines
        })

    return Response(data)
