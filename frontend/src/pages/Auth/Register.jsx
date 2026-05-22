import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { registerUser } from "../../services/apiServices";
import { useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().min(7, { message: "Enter a valid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["buyer", "supplier"], { required_error: "Please select a role" }),
});

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "buyer" }
  });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      const errData = err.response?.data;
      const msg = errData?.message
        || errData?.email?.[0]
        || errData?.username?.[0]
        || errData?.phone_number?.[0]
        || errData?.password?.[0]
        || "Registration failed. Please try again.";
      setApiError(msg);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border-none shadow-2xl text-center py-12 px-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold mb-3">Registration Successful!</CardTitle>
            <p className="text-slate-600 dark:text-slate-400">
              Your account is pending <strong>admin approval</strong>. You'll be notified by email once approved. Redirecting to login...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white">HiMed</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Join the premier medical supply platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {apiError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="johndoe" {...register("username")} />
                {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" type="tel" placeholder="+1234567890" {...register("phone_number")} />
                {errors.phone_number && <p className="text-xs text-red-600">{errors.phone_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min. 8 characters" {...register("password")} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <Label>I want to join as a:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center cursor-pointer">
                    <input type="radio" value="buyer" {...register("role")} className="peer sr-only" />
                    <div className="w-full rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-checked:border-[#0ea5e9] peer-checked:bg-blue-50 peer-checked:text-[#0ea5e9] text-center font-medium text-slate-700 transition-all">
                      🛒 Buyer
                    </div>
                  </label>
                  <label className="flex items-center justify-center cursor-pointer">
                    <input type="radio" value="supplier" {...register("role")} className="peer sr-only" />
                    <div className="w-full rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-checked:border-[#0ea5e9] peer-checked:bg-blue-50 peer-checked:text-[#0ea5e9] text-center font-medium text-slate-700 transition-all">
                      🏭 Supplier
                    </div>
                  </label>
                </div>
                {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#0ea5e9] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
