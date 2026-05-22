import { Outlet, Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, Pill, ShoppingCart, MessageSquare, Users, LogOut, Bell, ShieldCheck, Settings } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui/button";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getLinksByRole = () => {
    const role = user?.role;
    const securityLink = { name: "Security (MFA)", href: "/setup-mfa", icon: ShieldCheck };

    if (role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Pending Users", href: "/admin/pending-users", icon: Users },
        { name: "Medicines", href: "/catalog", icon: Pill },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        securityLink,
      ];
    }
    if (role === "supplier") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Medicines", href: "/supplier/medicines", icon: Pill },
        { name: "Orders", href: "/supplier/orders", icon: ShoppingCart },
        securityLink,
      ];
    }
    if (role === "buyer") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Browse Medicines", href: "/catalog", icon: Pill },
        { name: "Order History", href: "/buyer/orders", icon: ShoppingCart },
        securityLink,
      ];
    }
    return [];
  };

  const links = getLinksByRole();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-white dark:bg-slate-900 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HiMed</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold uppercase">
                {user?.username?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username}</span>
                <span className="text-xs text-slate-500 uppercase">{user?.role}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center md:hidden">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">HiMed</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
