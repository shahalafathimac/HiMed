import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Activity,
  LayoutDashboard,
  Pill,
  ShoppingCart,
  MessageSquare,
  Users,
  LogOut,
  Bell,
  Settings,
  Moon,
  Sun,
  Dot,
  AlertTriangle,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useNotifications } from "../hooks/useNotifications";
import { Button } from "../components/ui/button";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const {
    notifications,
    unreadCount,
    notificationsLoading,
    markAsRead,
  } = useNotifications();

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('himed-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update theme when toggled
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('himed-theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  const getLinksByRole = () => {
    const role = user?.role;

    if (role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Pending Users", href: "/admin/pending-users", icon: Users },
        { name: "Medicines", href: "/catalog", icon: Pill },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
      ];
    }

    if (role === "supplier") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Medicines", href: "/supplier/medicines", icon: Pill },
        { name: "Orders", href: "/supplier/orders", icon: ShoppingCart },
      ];
    }
    if (role === "buyer") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Browse Medicines", href: "/catalog", icon: Pill },
        { name: "Order History", href: "/buyer/orders", icon: ShoppingCart },
      ];
    }
    return [];
  };

  const links = getLinksByRole();

  return (
    <div className={`flex min-h-screen bg-slate-50 ${isDarkMode ? 'dark:bg-slate-950' : ''}`}>
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
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive
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
              <span className="font-bold text-xl text-slate-900 dark:text-white">HiMed</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-opacity-20 z-40">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {!notificationsLoading && notifications.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-slate-500">No notifications</div>
                    ) : (
                      <>
                        {notificationsLoading ? (
                          <div className="px-4 py-2 text-sm text-slate-500">
                            Loading notifications...
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {notifications.map((notification) => (
                              <div key={notification.id} className={`px-4 py-2 ${notification.is_read ? '' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 h-6 w-6">
                                    {notification.notification_type === 'order' && (
                                      <ShoppingCart className="h-5 w-5 text-primary" />
                                    )}
                                    {notification.notification_type === 'approval' && (
                                      <Users className="h-5 w-5 text-green-500" />
                                    )}
                                    {notification.notification_type === 'low_stock' && (
                                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    )}
                                    {notification.notification_type === 'general' && (
                                      <Bell className="h-5 w-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{notification.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{notification.message}</p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {!notification.is_read && (
                                      <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                                      >
                                        <Dot className="h-4 w-4 text-primary fill-primary" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        (Array.isArray(notifications)
                          ? notifications
                          : []
                        )
                          .filter((n) => !n.is_read)
                          .forEach((n) => markAsRead(n.id));
                        setIsNotificationDropdownOpen(false);
                      }}
                      className="w-full text-xs"
                    >
                      Mark all as read
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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