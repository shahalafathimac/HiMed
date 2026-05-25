from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):

    medicine_name = serializers.CharField(
        source="medicine.name",
        read_only=True
    )

    buyer_name = serializers.CharField(
        source="buyer.username",
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "medicine_name",
            "buyer_name",
            "quantity",
            "total_price",
            "status",
            "created_at",
        ]