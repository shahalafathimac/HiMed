from django.core.mail import send_mail

from django.conf import settings


def send_registration_email_to_user(user):

    subject = "Welcome to MediLinkX"

    message = f"""

Hello {user.username},

Your MediLinkX account has been created successfully.

Your account is currently pending admin approval.

You will be notified once approved.

Thank you,
MediLinkX Team
"""

    send_mail(

        subject,

        message,

        settings.EMAIL_HOST_USER,

        [user.email],

        fail_silently=False
    )


def send_registration_email_to_admin(user):

    subject = "New User Registration"

    message = f"""

A new user has registered.

Username: {user.username}

Email: {user.email}

Role: {user.role}

Please review and approve the account.

"""

    send_mail(

        subject,

        message,

        settings.EMAIL_HOST_USER,

        [settings.EMAIL_HOST_USER],

        fail_silently=False
    )