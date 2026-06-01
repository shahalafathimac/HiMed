from celery import shared_task

@shared_task
def task_send_registration_email_to_user(user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_registration_email_to_user
    try:
        user = Account.objects.get(id=user_id)
        send_registration_email_to_user(user)
    except Account.DoesNotExist:
        pass


@shared_task
def task_send_registration_email_to_admin(user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_registration_email_to_admin
    try:
        user = Account.objects.get(id=user_id)
        send_registration_email_to_admin(user)
    except Account.DoesNotExist:
        pass


@shared_task
def task_send_approval_email_to_user(user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_approval_email_to_user
    try:
        user = Account.objects.get(id=user_id)
        send_approval_email_to_user(user)
    except Account.DoesNotExist:
        pass
