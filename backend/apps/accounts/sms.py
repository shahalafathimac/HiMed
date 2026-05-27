import requests
from django.conf import settings

def send_sms(phone_number, message):
    try:
        response = requests.post(
            "https://www.fast2sms.com/dev/bulkV2",
            headers={
                "authorization": settings.FAST2SMS_API_KEY
            },
            data={
                "message": message,
                "language": "english",
                "route": "q",
                "numbers": phone_number,
            }
        )
        print(f"SMS API response: {response.json()}")  # ✅ keep this for debugging
        return response.json()
    except Exception as e:
        print(f"SMS error: {e}")
        return None


def send_order_sms(phone_number, status, order_id, medicine_name, buyer_name=""):
    messages = {
        "pending": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"placed successfully on HiMed. -HiMed"
        ),
        "processing": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"is being processed. We will update you soon. -HiMed"
        ),
        "shipped": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"has been shipped. Delivery on the way! -HiMed"
        ),
        "out_for_delivery": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"is out for delivery today. Keep phone reachable. -HiMed"
        ),
        "delivered": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"delivered successfully. Thank you for choosing HiMed!"
        ),
        "cancelled": (
            f"Hi {buyer_name}, Order #{order_id} for {medicine_name} "
            f"has been cancelled. Contact HiMed for support."
        ),
    }

    message = messages.get(status)
    print(f"DEBUG → phone: {phone_number}, status: {status}, message: {message}")
    if message and phone_number:
        result = send_sms(phone_number, message)
        print(f"SMS Result: {result}")