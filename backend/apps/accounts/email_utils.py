from django.core.mail import send_mail
from django.conf import settings


def send_himed_mail(subject, message, recipients):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipients,
        fail_silently=False
    )


def send_registration_email_to_user(user):

    subject = "[HiMed] Registration Received - Pending Approval"  # ✅ changed

    message = f"""
Hello {user.username},

Thank you for registering on HiMed!

Your account has been created and is currently PENDING admin approval.
You will receive a separate email once your account is approved.

Please do NOT try to login until you receive the approval email.

Best Regards,
HiMed Team
"""

    send_himed_mail(
        subject,
        message,
        [user.email]
    )


def send_registration_email_to_admin(user):

    subject = "[HiMed Admin] New User Pending Approval"  # ✅ changed

    message = f"""
A new user has registered on HiMed and is awaiting approval.

Username: {user.username}
Email: {user.email}
Role: {user.role}
Phone: {user.phone_number}

Please login to admin dashboard to approve or reject.
Dashboard: http://localhost:5173/login

HiMed System
"""

    send_himed_mail(
        subject,
        message,
        [settings.ADMIN_EMAIL]
    )


def send_approval_email_to_user(user):

    subject = "[HiMed] Your Account is Approved - Login Now!"  # ✅ changed

    message = f"""
Hello {user.username},

Congratulations! Your HiMed account has been APPROVED
by the administrator.

You can now login and access your dashboard.

Account Details:
- Username: {user.username}
- Email: {user.email}
- Role: {user.role.capitalize()}


Welcome aboard!

Best Regards,
HiMed Team
"""

    send_himed_mail(
        subject,
        message,
        [user.email]
    )
