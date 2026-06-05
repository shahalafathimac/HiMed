import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def send_himed_mail(subject, message, recipients):
    logger.info(
        "Sending email | subject=%s | recipients=%s",
        subject, recipients
    )
    try:
        sent = send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipients,
            fail_silently=False
        )
        if sent:
            logger.info(
                "Email sent successfully | subject=%s | recipients=%s",
                subject, recipients
            )
        else:
            logger.warning(
                "Email sent returned 0 | subject=%s | recipients=%s",
                subject, recipients
            )
        return sent
    except Exception as e:
        logger.error(
            "Email sending failed | subject=%s | recipients=%s | error=%s",
            subject, recipients, str(e), exc_info=True
        )
        raise


def send_registration_email_to_user(user):

    subject = "[HiMed] Registration Received - Pending Approval" 

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

    subject = "[HiMed Admin] New User Pending Approval"

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


def send_rejection_email_to_user(user):

    subject = "[HiMed] Account Registration Rejected"

    message = f"""
Hello {user.username},

Thank you for your interest in joining HiMed.

After reviewing your registration, we regret to inform you that
your account has been rejected by the administrator.

If you believe this is an error, please contact our support team.

We appreciate your understanding.

Best Regards,
HiMed Team
"""

    send_himed_mail(
        subject,
        message,
        [user.email]
    )


def send_approval_email_to_user(user):

    subject = "[HiMed] Your Account is Approved - Login Now!" 

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
