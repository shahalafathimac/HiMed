from rest_framework import serializers
from .models import Account
from django.contrib.auth.models import Group


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "username",
            "email",
            "password",
            "phone_number",
            "role",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def create(self, validated_data):
        role = validated_data["role"]
        is_admin = role == "admin"
        user = Account.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=role,
            phone_number=validated_data["phone_number"],
            is_approved=is_admin,
            is_staff=is_admin,
        )

        group, _ = Group.objects.get_or_create(name=role.capitalize())
        user.groups.add(group)
        return user
