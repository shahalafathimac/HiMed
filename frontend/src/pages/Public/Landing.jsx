import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const workflow = [
  {
    icon: MailCheck,
    title: "Register",
    text: "Create a buyer or supplier account. HiMed emails you and alerts the admin.",
  },
  {
    icon: BadgeCheck,
    title: "Admin approval",
    text: "Approved users receive an email confirmation before signing in.",
  },
  {
    icon: LockKeyhole,
    title: "MFA login",
    text: "Scan the QR code once, then enter the 6-digit authenticator code.",
  },
];

const capabilities = [
  {
    icon: ShoppingCart,
    title: "Buyer purchasing",
    text: "Browse medicines, manage cart items, place orders, and track history.",
  },
  {
    icon: Truck,
    title: "Supplier operations",
    text: "Manage medicines, stock levels, incoming orders, and fulfillment status.",
  },
  {
    icon: ClipboardList,
    title: "Admin control",
    text: "Approve accounts, monitor orders, review contacts, and keep the marketplace clean.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/72" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-sky-300/40 bg-sky-400/15 px-3 py-2 text-sm font-semibold text-sky-100">
              <ShieldCheck className="h-4 w-4" />
              Approved medical supply marketplace
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              HiMed connects buyers, suppliers, and admins in one secure workflow.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Register, wait for admin approval, sign in with authenticator MFA,
              and continue directly to the dashboard built for your role.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 rounded-md px-6 text-base" asChild>
                <Link to="/register">
                  Register
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-md border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white hover:text-slate-950"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mt-12 grid max-w-5xl gap-3 md:grid-cols-3">
            {workflow.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
                className="rounded-md border border-white/15 bg-white/10 p-5 backdrop-blur"
              >
                <item.icon className="h-6 w-6 text-sky-300" />
                <h2 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for real medical supply work
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Each role gets a focused dashboard after approval and MFA.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <item.icon className="h-7 w-7 text-teal-500" />
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
