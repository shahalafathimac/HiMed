import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLoginMFA } from "../../services/apiServices";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function VerifyMFA() {
  const navigate = useNavigate();
  const { mfaUserId, setAuth, logout } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Guard: if no userId in store, redirect back to login
  if (!mfaUserId) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    setError("");

    try {
      const response = await verifyLoginMFA({ user_id: mfaUserId, otp });
      const { access_token, refresh_token } = response.data;
      setAuth(
        { username: "User" }, // will be enriched when dashboard loads
        access_token,
        refresh_token
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-2xl">
          <div className="pt-8 pb-2 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0ea5e9]/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-[#0ea5e9]" />
            </div>
          </div>
          <CardHeader className="space-y-1 text-center pt-0">
            <CardTitle className="text-2xl font-bold">Two-Factor Verification</CardTitle>
            <CardDescription>
              Open your authenticator app and enter the 6-digit code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full text-center text-4xl tracking-[0.6em] font-mono h-16 rounded-md border border-slate-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] placeholder:text-slate-300"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-[#0ea5e9] hover:bg-[#0284c7]"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
