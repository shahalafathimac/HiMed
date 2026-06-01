from django.db import models

from django.contrib.auth.models import AbstractUser


import pyotp


class Account(AbstractUser):

    ROLE_CHOICES = (
        ('supplier', 'Supplier'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    phone_number = models.CharField(
        max_length=15
    )

    is_approved = models.BooleanField(
        default=False
    )

    mfa_secret = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    is_mfa_enabled = models.BooleanField(
        default=False
    )

    class Meta:
        db_table = "accounts_user"

    def generate_mfa_secret(self):

        self.mfa_secret = pyotp.random_base32()

        self.save()

    def _str_(self):

        return self.username
