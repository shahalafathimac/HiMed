import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLoginMFA } from "../../services/apiServices";
import useAuthStore from "../../store/useAuthStore";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";

import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function VerifyMFA() {
  const navigate = useNavigate();

  const {
    mfaUserId,
    isAuthenticated,
    setAuth,
    logout,
  } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if user refreshes page
  // and MFA user id no longer exists
  useEffect(() => {
    if (!mfaUserId && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [mfaUserId, isAuthenticated, navigate]);

  if (!mfaUserId && !isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await verifyLoginMFA({
        user_id: mfaUserId,
        otp,
      });

      const {
        access_token,
        refresh_token,
      } = response.data;

      // Save auth data to Zustand store
      setAuth(
        { username: "User" },
        access_token,
        refresh_token
      );

      console.log("MFA VERIFIED");
      console.log(useAuthStore.getState());

      setLoading(false);

      // Redirect to dashboard
      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(err);

      setLoading(false);

      setError(
        err?.response?.data?.message ||
        "Invalid verification code"
      );
    }
  };

  const handleCancel = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="pt-8 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-sky-600" />
          </div>
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Two-Factor Authentication
          </CardTitle>

          <CardDescription>
            Enter the 6-digit code from your
            authenticator application.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <input
              type="text"
              value={otp}
              maxLength={6}
              autoFocus
              inputMode="numeric"
              placeholder="000000"
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              className="
                w-full
                h-16
                text-center
                text-3xl
                font-mono
                tracking-[0.5em]
                rounded-md
                border
                border-slate-300
                focus:ring-2
                focus:ring-sky-500
                focus:border-sky-500
                outline-none
              "
            />

            <Button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="w-full h-11"
            >
              {loading
                ? "Verifying..."
                : "Verify & Sign In"}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                text-sm
                text-slate-500
                hover:text-slate-700
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}