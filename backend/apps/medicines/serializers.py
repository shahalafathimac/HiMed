from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.username", read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:

        model = Medicine

        fields = "__all__"

        read_only_fields = [
            "supplier"
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url
