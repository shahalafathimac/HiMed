import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { Users, Pill, ShoppingCart, DollarSign, Activity, AlertTriangle } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const chartData = [
  { name: "Jan", total: 3200 },
  { name: "Feb", total: 4100 },
  { name: "Mar", total: 2800 },
  { name: "Apr", total: 5300 },
  { name: "May", total: 4800 },
  { name: "Jun", total: 6100 },
];

export default function Dashboard() {
  const { updateUser, user } = useAuthStore();

  const { data: dashboardInfo, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const res = await fetchDashboardData();
      return res.data;
    }
  });

  // Enrich the Zustand user object with role and username from backend
  useEffect(() => {
    if (dashboardInfo) {
      updateUser({
        role: dashboardInfo.role,
        username: dashboardInfo.username || user?.username || dashboardInfo.role,
      });
    }
  }, [dashboardInfo]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="h-10 w-10 text-[#0ea5e9] animate-pulse mx-auto" />
          <p className="text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const role = dashboardInfo?.role;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Welcome back, <span className="font-medium text-slate-700 dark:text-slate-300">{dashboardInfo?.username || user?.username}</span>
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider">
          {role}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {role === "admin" && (
          <>
            <StatCard title="Total Users" value="2,543" icon={Users} trend="+12% from last month" />
            <StatCard title="Total Medicines" value="12,300" icon={Pill} trend="+8% from last month" />
            <StatCard title="Total Orders" value="45,231" icon={ShoppingCart} trend="+22% from last month" />
            <StatCard title="Platform Revenue" value="$2.4M" icon={DollarSign} trend="+18% from last month" />
          </>
        )}
        {role === "supplier" && (
          <>
            <StatCard title="My Medicines" value="142" icon={Pill} trend="+4 new this week" />
            <StatCard title="Low Stock Items" value="12" icon={AlertTriangle} trend="Requires attention" alert />
            <StatCard title="Pending Orders" value="38" icon={ShoppingCart} trend="15 received today" />
            <StatCard title="Revenue" value="$45,231" icon={DollarSign} trend="+12% from last month" />
          </>
        )}
        {role === "buyer" && (
          <>
            <StatCard title="Active Orders" value="4" icon={ShoppingCart} trend="2 arriving today" />
            <StatCard title="Total Spent" value="$12,450" icon={DollarSign} trend="+5% this month" />
            <StatCard title="Available Medicines" value="12,300+" icon={Pill} trend="Browse catalog" />
            <StatCard title="Notifications" value="3" icon={Activity} trend="3 unread" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgb(0 0 0 / 0.08)" }}
                    formatter={(v) => [`$${v}`, "Revenue"]}
                  />
                  <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgb(0 0 0 / 0.08)" }}
                    formatter={(v) => [v, "Orders"]}
                  />
                  <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, alert }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${alert ? "bg-red-50" : "bg-slate-50"}`}>
          <Icon className={`h-4 w-4 ${alert ? "text-red-500" : "text-slate-500"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${alert ? "text-red-500 font-medium" : "text-slate-500"}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}