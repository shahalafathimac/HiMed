import pyotp
import qrcode
from io import BytesIO
import base64


def generate_mfa_secret():
    return pyotp.random_base32()


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
        return False

    totp = pyotp.TOTP(secret)
    return totp.verify(otp)