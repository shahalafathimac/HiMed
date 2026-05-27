from django.shortcuts import render
from apps.accounts.permissions import (IsBuyer, IsSupplier, IsAdmin)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, Cart, CartItem
from .serializers import OrderSerializer, CartSerializer
from apps.medicines.models import Medicine
from apps.notifications.services import create_notification
from apps.accounts.sms import send_order_sms


class PlaceOrderView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def post(self, request):

        medicine_id = request.data.get("medicine_id")
        quantity = int(request.data.get("quantity"))
        medicine = Medicine.objects.get(id=medicine_id)

        if medicine.stock < quantity:
            return Response({
                "message": "Insufficient stock"
            }, status=400)

        total_price = medicine.price * quantity

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

        # ✅ SMS to buyer with name
        send_order_sms(
            request.user.phone_number,
            "pending",
            order.id,
            medicine.name,
            request.user.username
        )

        medicine.stock -= quantity
        medicine.save()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id
        })


class OrderHistoryView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def get(self, request):

        orders = Order.objects.filter(buyer=request.user)

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class OrderStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        order = Order.objects.get(id=pk)

        return Response({
            "order_id": order.id,
            "status": order.status
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

        # ✅ SMS to buyer on cancellation with name
        send_order_sms(
            request.user.phone_number,
            "cancelled",
            order.id,
            order.medicine.name,
            request.user.username
        )

        return Response({"message": "Order cancelled"})


class SupplierOrdersView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def get(self, request):

        orders = Order.objects.filter(
            medicine__supplier=request.user
        )

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class UpdateOrderStatusView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def put(self, request, pk):

        order = Order.objects.get(id=pk)
        status_value = request.data.get("status")
        order.status = status_value
        order.save()

        # ✅ SMS to buyer on every status change with name
        send_order_sms(
            order.buyer.phone_number,
            status_value,
            order.id,
            order.medicine.name,
            order.buyer.username
        )

        return Response({"message": "Status updated"})


class AdminOrdersView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def get(self, request):

        orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


def get_or_create_cart(user):
    cart, created = Cart.objects.get_or_create(buyer=user)
    return cart


class CartView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def get(self, request):

        cart = get_or_create_cart(request.user)

        serializer = CartSerializer(
            cart,
            context={"request": request}
        )

        return Response(serializer.data)


class AddCartItemView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def post(self, request):

        medicine_id = request.data.get("medicine_id")
        quantity = int(request.data.get("quantity", 1))

        if quantity < 1:
            return Response({
                "message": "Quantity must be at least 1"
            }, status=400)

        try:
            medicine = Medicine.objects.get(id=medicine_id)
        except Medicine.DoesNotExist:
            return Response({
                "message": "Medicine not found"
            }, status=404)

        if medicine.stock < quantity:
            return Response({
                "message": "Insufficient stock"
            }, status=400)

        cart = get_or_create_cart(request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            medicine=medicine,
            defaults={"quantity": quantity}
        )

        if not created:
            next_quantity = item.quantity + quantity
            if medicine.stock < next_quantity:
                return Response({
                    "message": "Insufficient stock"
                }, status=400)
            item.quantity = next_quantity
            item.save()

        serializer = CartSerializer(
            cart,
            context={"request": request}
        )

        return Response(serializer.data, status=201)


class UpdateCartItemView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def put(self, request, pk):

        quantity = int(request.data.get("quantity", 1))

        if quantity < 1:
            return Response({
                "message": "Quantity must be at least 1"
            }, status=400)

        try:
            item = CartItem.objects.select_related(
                "cart", "medicine"
            ).get(id=pk, cart__buyer=request.user)
        except CartItem.DoesNotExist:
            return Response({
                "message": "Cart item not found"
            }, status=404)

        if item.medicine.stock < quantity:
            return Response({
                "message": "Insufficient stock"
            }, status=400)

        item.quantity = quantity
        item.save()

        serializer = CartSerializer(
            item.cart,
            context={"request": request}
        )

        return Response(serializer.data)


class RemoveCartItemView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def delete(self, request, pk):

        try:
            item = CartItem.objects.get(
                id=pk,
                cart__buyer=request.user
            )
        except CartItem.DoesNotExist:
            return Response({
                "message": "Cart item not found"
            }, status=404)

        cart = item.cart
        item.delete()

        serializer = CartSerializer(
            cart,
            context={"request": request}
        )

        return Response(serializer.data)


class CheckoutCartView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def post(self, request):

        cart = get_or_create_cart(request.user)
        items = cart.items.select_related(
            "medicine", "medicine__supplier"
        )

        if not items.exists():
            return Response({
                "message": "Cart is empty"
            }, status=400)

        for item in items:
            if item.medicine.stock < item.quantity:
                return Response({
                    "message": f"Insufficient stock for {item.medicine.name}"
                }, status=400)

        order_ids = []
        for item in items:
            medicine = item.medicine
            order = Order.objects.create(
                buyer=request.user,
                medicine=medicine,
                quantity=item.quantity,
                total_price=medicine.price * item.quantity
            )
            order_ids.append(order.id)

            create_notification(
                request.user,
                "Order Created",
                f"Your order for {medicine.name} was placed successfully.",
                "order"
            )

            create_notification(
                medicine.supplier,
                "New Order Received",
                f"A new order has been placed for {medicine.name}.",
                "order"
            )

            # ✅ SMS for each item in cart checkout with name
            send_order_sms(
                request.user.phone_number,
                "pending",
                order.id,
                medicine.name,
                request.user.username
            )

            medicine.stock -= item.quantity
            medicine.save()

        items.delete()

        return Response({
            "message": "Checkout completed",
            "order_ids": order_ids
        })