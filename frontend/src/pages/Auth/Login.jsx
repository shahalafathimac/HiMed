import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { loginUser } from "../../services/apiServices";
import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";
import { Activity } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, setMfaRequired } = useAuthStore();
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const response = await loginUser(data);
      const resData = response.data;

      if (resData.mfa_required) {
        // User already has MFA enabled, go to OTP verification
        setMfaRequired(resData.user_id);
        navigate("/verify-mfa");
      } else {
        // User doesn't have MFA enabled yet. Force them to set it up!
        useAuthStore.getState().setTempTokens(
          { username: data.email.split("@")[0], email: data.email },
          resData.access_token,
          resData.refresh_token
        );
        navigate("/setup-mfa");
      }
    } catch (err) {
      const errData = err.response?.data;
      setApiError(errData?.message || errData?.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2">
          <Activity className="h-8 w-8 text-[#0ea5e9]" />
          <span className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white">HiMed</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your HiMed account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {apiError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  {...register("password")}
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-[#0ea5e9] hover:bg-[#0284c7]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[#0ea5e9] hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
