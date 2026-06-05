import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupMFA, verifyMFA } from "../../services/authservice";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { QrCode, ShieldCheck, AlertCircle } from "lucide-react";

export default function SetupMFA() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [qrCode, setQrCode] = useState(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (qrCode) return;

    let isMounted = true;

    const generateQR = async () => {
      setError("");
      try {
        const res = await setupMFA();
        if (isMounted) {
          setQrCode(res.data.qr_code);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to generate QR code. Make sure you are logged in.");
        }
      }
    };

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [qrCode]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setVerifying(true);
    setError("");
    try {
      const res = await verifyMFA(otp);
      updateUser(res.data?.user || { is_mfa_enabled: true });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const formattedQrCode = qrCode?.startsWith("data:image")
    ? qrCode
    : `data:image/png;base64,${qrCode}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0ea5e9]/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-[#0ea5e9]" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Setup Authenticator
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              Scan the QR code and enter the 6-digit PIN to enable Two-Factor Authentication.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-8">
            {error && (
              <div className="p-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
              {!qrCode ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-slate-300 animate-pulse" />
                </div>
              ) : (
                <img
                  src={formattedQrCode}
                  alt="MFA QR Code"
                  className="w-48 h-48 rounded-md shadow-sm bg-white p-2"
                />
              )}
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[0.4em] font-mono h-14 rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] shadow-sm transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] shadow-md h-12 text-base font-semibold"
                disabled={verifying || otp.length < 6}
              >
                {verifying ? "Verifying..." : "Verify & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
