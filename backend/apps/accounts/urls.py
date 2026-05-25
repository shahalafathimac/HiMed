from django.urls import path
from .views import (
    RegisterView,
    login_view,
    verify_login_mfa,
    refresh_token_view,
    profile_view,
    SetupMFAView,
    VerifyMFAView,
    pending_users,
    approve_user,
    reject_user,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", login_view),
    path("verify-login-mfa/", verify_login_mfa),
    path("token/refresh/", refresh_token_view),
    path("profile/", profile_view),
    path("setup-mfa/", SetupMFAView.as_view()),
    path("verify-mfa/", VerifyMFAView.as_view()),
    path("pending-users/", pending_users),
    path("approve-user/<int:user_id>/", approve_user),
    path("reject-user/<int:user_id>/", reject_user),
]
