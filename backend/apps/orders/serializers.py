from rest_framework import serializers
from .models import Order, Cart, CartItem

class OrderSerializer(serializers.ModelSerializer):

    medicine_name = serializers.CharField(
        source="medicine.name",
        read_only=True
    )

    buyer_name = serializers.CharField(
        source="buyer.username",
        read_only=True
    )

    medicine_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Order

        fields = [
            "id",
            "medicine_name",
            "medicine_image_url",
            "buyer_name",
            "quantity",
            "total_price",
            "status",
            "created_at",
        ]

    def get_medicine_image_url(self, obj):
        if not obj.medicine.image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.medicine.image.url)

        return obj.medicine.image.url


class CartItemSerializer(serializers.ModelSerializer):

    medicine_id = serializers.IntegerField(
        source="medicine.id",
        read_only=True
    )

    name = serializers.CharField(
        source="medicine.name",
        read_only=True
    )

    price = serializers.DecimalField(
        source="medicine.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    stock = serializers.IntegerField(
        source="medicine.stock",
        read_only=True
    )

    supplier_name = serializers.CharField(
        source="medicine.supplier.username",
        read_only=True
    )

    image_url = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem

        fields = [
            "id",
            "medicine_id",
            "name",
            "price",
            "stock",
            "supplier_name",
            "image_url",
            "quantity",
            "line_total",
        ]

    def get_image_url(self, obj):
        if not obj.medicine.image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.medicine.image.url)

        return obj.medicine.image.url

    def get_line_total(self, obj):
        return obj.medicine.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "items",
            "subtotal",
            "item_count",
        ]

    def get_subtotal(self, obj):
        return sum(
            item.medicine.price * item.quantity
            for item in obj.items.select_related("medicine")
        )

    def get_item_count(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )
