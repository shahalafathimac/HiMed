from celery import shared_task

@shared_task
def task_send_registration_email_to_user(user_id):
    from apps.accounts.models import User
    from apps.accounts.email_utils import send_registration_email_to_user
    try:
        user = User.objects.get(id=user_id)
        send_registration_email_to_user(user)
    except User.DoesNotExist:
        pass


@shared_task
def task_send_registration_email_to_admin(user_id):
    from apps.accounts.models import User
    from apps.accounts.email_utils import send_registration_email_to_admin
    try:
        user = User.objects.get(id=user_id)
        send_registration_email_to_admin(user)
    except User.DoesNotExist:
        pass


@shared_task
def task_send_approval_email_to_user(user_id):
    from apps.accounts.models import User
    from apps.accounts.email_utils import send_approval_email_to_user
    try:
        user = User.objects.get(id=user_id)
        send_approval_email_to_user(user)
    except User.DoesNotExist:
        pass