import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def task_send_registration_email_to_user(self, user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_registration_email_to_user
    try:
        user = Account.objects.get(id=user_id)
        send_registration_email_to_user(user)
        logger.info("Registration email sent to user | user_id=%s", user_id)
    except Account.DoesNotExist:
        logger.warning(
            "Registration email skipped - user not found | user_id=%s",
            user_id
        )
    except Exception as e:
        logger.error(
            "Registration email to user failed | user_id=%s | error=%s",
            user_id, str(e), exc_info=True
        )
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def task_send_registration_email_to_admin(self, user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_registration_email_to_admin
    try:
        user = Account.objects.get(id=user_id)
        send_registration_email_to_admin(user)
        logger.info("Registration email sent to admin | user_id=%s", user_id)
    except Account.DoesNotExist:
        logger.warning(
            "Registration email to admin skipped - user not found | user_id=%s",
            user_id
        )
    except Exception as e:
        logger.error(
            "Registration email to admin failed | user_id=%s | error=%s",
            user_id, str(e), exc_info=True
        )
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def task_send_approval_email_to_user(self, user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_approval_email_to_user
    try:
        user = Account.objects.get(id=user_id)
        send_approval_email_to_user(user)
        logger.info("Approval email sent to user | user_id=%s", user_id)
    except Account.DoesNotExist:
        logger.warning(
            "Approval email skipped - user not found | user_id=%s",
            user_id
        )
    except Exception as e:
        logger.error(
            "Approval email to user failed | user_id=%s | error=%s",
            user_id, str(e), exc_info=True
        )
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def task_send_rejection_email_to_user(self, user_id):
    from apps.accounts.models import Account
    from apps.accounts.email_utils import send_rejection_email_to_user
    try:
        user = Account.objects.get(id=user_id)
        send_rejection_email_to_user(user)
        logger.info("Rejection email sent to user | user_id=%s", user_id)
    except Account.DoesNotExist:
        logger.warning(
            "Rejection email skipped - user not found | user_id=%s",
            user_id
        )
    except Exception as e:
        logger.error(
            "Rejection email to user failed | user_id=%s | error=%s",
            user_id, str(e), exc_info=True
        )
        raise self.retry(exc=e)
