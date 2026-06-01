from celery import shared_task


@shared_task
def task_send_order_sms(phone_number, status, order_id, medicine_name, buyer_name=""):
    from apps.accounts.sms import send_order_sms
    send_order_sms(phone_number, status, order_id, medicine_name, buyer_name)
    return f"SMS sent to {phone_number} for order #{order_id}"