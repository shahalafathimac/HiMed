from django.db import models
from django.conf import settings


class Notification(models.Model):

    NOTIFICATION_TYPES = (

        ('approval', 'Approval'),
        ('order', 'Order'),
        ('low_stock', 'Low Stock'),
        ('general', 'General'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title
