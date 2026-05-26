from django.db import models
from apps.accounts.models import User
from apps.medicines.models import Medicine

# Create your models here.


class Order(models.Model):

    STATUS_CHOICES = [

        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="buyer_orders"
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField()

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.buyer.username} - {self.medicine.name}"


class Cart(models.Model):

    buyer = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.buyer.username}'s cart"


class CartItem(models.Model):

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = (
            "cart",
            "medicine"
        )

    def __str__(self):
        return f"{self.quantity} x {self.medicine.name}"
