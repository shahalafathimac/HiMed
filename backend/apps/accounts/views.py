from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .email_utils import (
    send_registration_email_to_user,
    send_registration_email_to_admin,
)
from .models import User
from .permissions import IsSupplier, IsBuyer, IsAdmin
from .mfa_utils import generate_qr_code, verify_totp
from apps.notifications.services import create_notification


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_registration_email_to_user(user)
            send_registration_email_to_admin(user)
            return Response({"message": "User registered successfully"})
        return Response(serializer.errors)


class VerifyMFAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        otp = request.data.get("otp")
        user = request.user
        is_valid = verify_totp(user.mfa_secret, otp)
        if not is_valid:
            return Response({"message": "Invalid MFA Code"}, status=400)
        user.is_mfa_enabled = True
        user.save()
        return Response({"message": "MFA Enabled Successfully"})


@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        db_user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    user = authenticate(username=db_user.username, password=password)

    if user is None:
        return Response({"message": "Invalid credentials"}, status=401)

   
    if not user.is_approved:
        return Response(
            {"message": "Your account is pending admin approval."},
            status=403
        )

    if user.is_mfa_enabled:
        return Response({
            "message": "MFA Required",
            "mfa_required": True,
            "user_id": user.id,
        })

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    })

@api_view(["POST"])
def refresh_token_view(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"message": "Refresh token required"}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        })
    except Exception:
        return Response({"message": "Invalid refresh token"}, status=401)


@api_view(["POST"])
def verify_login_mfa(request):
    user_id = request.data.get("user_id")
    otp = request.data.get("otp")

    if not user_id:
        return Response({"message": "user_id missing"}, status=status.HTTP_400_BAD_REQUEST)
    if not otp:
        return Response({"message": "OTP missing"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=int(user_id))
    except (User.DoesNotExist, ValueError):
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


    if not user.is_approved:
        return Response(
            {"message": "Your account is pending admin approval."},
            status=403
        )

    is_valid = verify_totp(user.mfa_secret, otp)
    if not is_valid:
        return Response({"message": "Invalid MFA Code"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login Successful",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    })


class SetupMFAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.mfa_secret:
            user.generate_mfa_secret()
        return Response({"qr_code": generate_qr_code(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response({
        "message": "Profile accessed",
        "email": request.user.email,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def pending_users(request):
    users = User.objects.filter(is_approved=False)
    data = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "phone_number": u.phone_number,
    } for u in users]
    return Response(data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdmin])
def approve_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    user.is_approved = True
    user.save()
    create_notification(user, "Account Approved", "Your account has been approved by the admin.", "approval")
    return Response({"message": "User approved successfully"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def reject_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    user.delete()
    return Response({"message": "User rejected successfully"})

