from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.username", read_only=True)

    class Meta:

        model = Medicine

        fields = "__all__"

        read_only_fields = [
            "supplier"
        ]