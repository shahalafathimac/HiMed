import logging
import time
import pyotp
import qrcode
from io import BytesIO
import base64

logger = logging.getLogger(__name__)


def generate_qr_code(user):
    totp = pyotp.TOTP(user.mfa_secret)
    provisioning_uri = totp.provisioning_uri(
        name=user.email,
        issuer_name="Himed"
    )

    qr = qrcode.make(provisioning_uri)
    buffered = BytesIO()
    qr.save(buffered, format="PNG")
    return base64.b64encode(
        buffered.getvalue()
    ).decode()


def verify_totp(secret, otp):
    if not secret or not otp:
        logger.warning("verify_totp skipped: missing secret or otp")
        return False

    totp = pyotp.TOTP(secret)
    result = totp.verify(otp, valid_window=2)
    if not result:
        logger.warning(
            "TOTP verify failed | secret_suffix=%s | otp=%s | ts=%s",
            secret[-4:], otp, int(time.time())
        )
    return result
