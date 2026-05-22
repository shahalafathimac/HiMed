from django.urls import path
from .views import (RegisterView,
                    login_view,
                    profile_view,
                    SetupMFAView,
                    VerifyMFAView,
                    verify_login_mfa,
                    pending_users,
                    approve_user,
                    reject_user,
                    )

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", login_view),
    path("profile/", profile_view),
    path('setup-mfa/',SetupMFAView.as_view()),
    path('verify-mfa/',VerifyMFAView.as_view()),
    path('verify-login-mfa/',verify_login_mfa),
    path('pending-users/',pending_users),
    path('approve-user/<int:user_id>/',approve_user),
    path('reject-user/<int:user_id>/',reject_user),
    
]
