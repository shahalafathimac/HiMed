import logging
import re
import requests
from django.conf import settings


logger = logging.getLogger(__name__)


def normalize_phone_number(phone_number):
    digits = re.sub(r"\D", "", str(phone_number or ""))

    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]

    return digits if len(digits) == 10 else ""


def send_sms(phone_number, message):
    normalized_number = normalize_phone_number(phone_number)

    if not normalized_number:
        logger.warning("SMS skipped: invalid phone number %s", phone_number)
        return {
            "return": False,
            "message": ["Invalid phone number. Use a 10 digit Indian mobile number."],
        }

    if not getattr(settings, "FAST2SMS_API_KEY", ""):
        logger.warning("SMS skipped: FAST2SMS_API_KEY is missing")
        return {
            "return": False,
            "message": ["FAST2SMS_API_KEY is missing."],
        }

    try:
        response = requests.post(
            "https://www.fast2sms.com/dev/bulk",
            headers={
                "authorization": settings.FAST2SMS_API_KEY,
            },
            data={
                "sender_id": "FSTSMS",
                "message": message,
                "language": "english",
                "route": "p",        # ✅ changed from "p" to "q"
                "numbers": normalized_number,
            },
            timeout=getattr(settings, "FAST2SMS_TIMEOUT", 20),
        )

        # ✅ Handle empty response body
        if response.status_code == 200:
            logger.info("Fast2SMS SMS sent successfully to %s", normalized_number)
            return {"return": True, "message": ["Message sent successfully"]}

        # Try to parse JSON only if there's content
        if response.text:
            result = response.json()
        else:
            result = {"return": False, "message": ["Empty response from Fast2SMS"]}

        logger.info("Fast2SMS response for %s: %s", normalized_number, result)
        return result

    except requests.exceptions.RequestException as exc:
        logger.exception("Fast2SMS request failed for %s", normalized_number)
        return {
            "return": False,
            "message": [str(exc)],
        }
    except ValueError:
        logger.exception("Fast2SMS returned a non-JSON response for %s", normalized_number)
        return {
            "return": False,
            "message": ["Fast2SMS returned a non-JSON response."],
        }


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
    if message and phone_number:
        return send_sms(phone_number, message)

    logger.warning(
        "SMS skipped: phone=%s status=%s message=%s",
        phone_number, status, message
    )
    return {
        "return": False,
        "message": ["Missing phone number or unsupported order status."],
    }
