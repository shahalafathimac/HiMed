from django.db import models

# Create your models here.


class ContactMessage(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    )

    name = models.CharField(max_length=100)

    email = models.EmailField()

    subject = models.CharField(max_length=255)

    message = models.TextField()

    admin_reply = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.subject
