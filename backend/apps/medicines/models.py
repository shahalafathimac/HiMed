from django.db import models
from apps.accounts.models import User


class Medicine(models.Model):

    supplier = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="medicines"
    )

    name = models.CharField(
        max_length=255
    )

    description = models.TextField()

    stock = models.IntegerField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to="medicine_images/",
        blank=True,
        null=True
    )

    expiry_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name
