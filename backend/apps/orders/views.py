from django.shortcuts import render
from apps.accounts.permissions import (IsBuyer,IsSupplier,IsAdmin)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from apps.medicines.models import Medicine
from apps.notifications.services import create_notification
# Create your views here.

class PlaceOrderView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def post(self, request):

        medicine_id = request.data.get(
            "medicine_id"
        )

        quantity = int(
            request.data.get(
                "quantity"
            )
        )

        medicine = Medicine.objects.get(
            id=medicine_id
        )

        if medicine.stock < quantity:

            return Response({

                "message":
                "Insufficient stock"

            }, status=400)

        total_price = (
            medicine.price * quantity
        )

        order = Order.objects.create(

            buyer=request.user,

            medicine=medicine,

            quantity=quantity,

            total_price=total_price

        )

        # Buyer Notification
        create_notification(

            request.user,

            "Order Created",

            f"Your order for {medicine.name} was placed successfully.",

            "order"
        )

        # Supplier Notification
        create_notification(

            medicine.supplier,

            "New Order Received",

            f"A new order has been placed for {medicine.name}.",

            "order"
        )

        medicine.stock -= quantity

        medicine.save()

        return Response({

            "message":
            "Order placed successfully",

            "order_id":
            order.id

        })



class OrderHistoryView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def get(self, request):

        orders = Order.objects.filter(
            buyer=request.user
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )


class OrderStatusView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pk):

        order = Order.objects.get(
            id=pk
        )

        return Response({

            "order_id":
            order.id,

            "status":
            order.status

        })


class CancelOrderView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def put(self, request, pk):

        order = Order.objects.get(
            id=pk,
            buyer=request.user
        )

        order.status = "cancelled"

        order.save()

        return Response({

            "message":
            "Order cancelled"

        })



class SupplierOrdersView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def get(self, request):

        orders = Order.objects.filter(

            medicine__supplier=
            request.user

        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )


class UpdateOrderStatusView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def put(self, request, pk):

        order = Order.objects.get(
            id=pk
        )

        status_value = request.data.get(
            "status"
        )

        order.status = status_value

        order.save()

        return Response({

            "message":
            "Status updated"

        })


class AdminOrdersView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def get(self, request):

        orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )




