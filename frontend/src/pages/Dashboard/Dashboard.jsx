import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardData,
  fetchLowStockMedicines,
  fetchMedicineAnalytics,
} from "../../services/apiServices";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  Users,
  Pill,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";

import useAuthStore from "../../store/useAuthStore";

export default function Dashboard() {
  const {
    user,
    updateUser,
    logout,
  } = useAuthStore();

  const { data: dashboardInfo, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const res = await fetchDashboardData();
      return res.data;
    },
  });

  const { data: lowStockMedicines = [], isLoading: lowStockLoading } =
    useQuery({
      queryKey: ["lowStockMedicines"],
      queryFn: async () => {
        const res = await fetchLowStockMedicines();
        return res.data;
      },
    });

  const { data: medicineAnalytics = {}, isLoading: analyticsLoading } =
    useQuery({
      queryKey: ["medicineAnalytics"],
      queryFn: async () => {
        const res = await fetchMedicineAnalytics();
        return res.data;
      },
    });

  useEffect(() => {
    if (
      dashboardInfo &&
      (
        user?.role !== dashboardInfo.role ||
        user?.username !== dashboardInfo.username
      )
    ) {
      updateUser({
        role: dashboardInfo.role,
        username: dashboardInfo.username,
      });
    }
  }, [dashboardInfo, user, updateUser]);

  const isLoading =
    dashboardLoading ||
    lowStockLoading ||
    analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="h-10 w-10 text-[#0ea5e9] animate-pulse mx-auto" />
          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const role = dashboardInfo?.role;
  const lowStockCount = lowStockMedicines?.length || 0;

  const revenueChartData =
    medicineAnalytics.monthly_revenue || [
      { name: "Jan", total: 3200 },
      { name: "Feb", total: 4100 },
      { name: "Mar", total: 2800 },
      { name: "Apr", total: 5300 },
      { name: "May", total: 4800 },
      { name: "Jun", total: 6100 },
    ];

  const orderChartData =
    medicineAnalytics.monthly_orders || [
      { name: "Jan", total: 3200 },
      { name: "Feb", total: 4100 },
      { name: "Mar", total: 2800 },
      { name: "Apr", total: 5300 },
      { name: "May", total: 4800 },
      { name: "Jun", total: 6100 },
    ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            Welcome back{" "}
            <span className="font-medium">
              {dashboardInfo?.username ||
                user?.username}
            </span>
          </p>
        </div>

        <span className="inline-flex items-center rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-sm font-semibold text-[#0ea5e9] uppercase">
          {role}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {role === "admin" && (
          <>
            <StatCard
              title="Total Users"
              value="2543"
              icon={Users}
              trend="+12% from last month"
            />
            <StatCard
              title="Total Medicines"
              value="12300"
              icon={Pill}
              trend="+8% from last month"
            />
            <StatCard
              title="Total Orders"
              value="45231"
              icon={ShoppingCart}
              trend="+22% from last month"
            />
            <StatCard
              title="Platform Revenue"
              value="$2.4M"
              icon={DollarSign}
              trend="+18% from last month"
            />
          </>
        )}

        {role === "supplier" && (
          <>
            <StatCard
              title="My Medicines"
              value="142"
              icon={Pill}
              trend="+4 new this week"
            />
            <StatCard
              title="Low Stock Items"
              value={lowStockCount}
              icon={AlertTriangle}
              trend="Requires attention"
              alert
            />
            <StatCard
              title="Pending Orders"
              value="38"
              icon={ShoppingCart}
              trend="15 received today"
            />
            <StatCard
              title="Revenue"
              value="$45,231"
              icon={DollarSign}
              trend="+12% from last month"
            />
          </>
        )}

        {role === "buyer" && (
          <>
            <StatCard
              title="Active Orders"
              value="4"
              icon={ShoppingCart}
              trend="2 arriving today"
            />
            <StatCard
              title="Total Spent"
              value="$12,450"
              icon={DollarSign}
              trend="+5% this month"
            />
            <StatCard
              title="Available Medicines"
              value="12300+"
              icon={Pill}
              trend="Browse catalog"
            />
            <StatCard
              title="Notifications"
              value="3"
              icon={Activity}
              trend="3 unread"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              Revenue Overview
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#0ea5e9"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              Order Trends
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={orderChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  alert,
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>

        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${alert
            ? "bg-red-50"
            : "bg-slate-50"
            }`}
        >
          <Icon
            className={`h-4 w-4 ${alert
              ? "text-red-500"
              : "text-slate-500"
              }`}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>

        {trend && (
          <p
            className={`text-xs mt-1 ${alert
              ? "text-red-500 font-medium"
              : "text-slate-500"
              }`}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}