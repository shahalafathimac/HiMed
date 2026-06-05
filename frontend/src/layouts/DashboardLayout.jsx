import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Truck,
  Store,
  FileText,
  Heart,
  User,
  Menu,
  X,
  Edit2,
  Save,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useNotifications } from "../hooks/useNotifications";
import useWishlist from "../hooks/useWishlist";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { fetchCart } from "../services/apiServices";
import { updateProfile } from "../services/authservice";

export default function DashboardLayout() {
  const { user, logout, updateUser } = useAuthStore();
  const location = useLocation();
  const { items: wishlistItems } = useWishlist();
  const {
    notifications,
    unreadCount,
    notificationsLoading,
    markAsRead,
  } = useNotifications();

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });
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

  const { data: cartResponse } = useQuery({
    queryKey: ["buyerCart"],
    queryFn: fetchCart,
    enabled: user?.role === "buyer",
  });

  const cartCount = cartResponse?.data?.item_count || 0;

  const handleProfileSave = async () => {
    try {
      setIsSavingProfile(true);
      setProfileError("");
      const response = await updateProfile(profileForm);
      updateUser(response.data);
      setProfileForm({
        username: response.data?.username || "",
        email: response.data?.email || "",
        phone_number: response.data?.phone_number || "",
      });
      setIsEditingProfile(false);
    } catch (err) {
      const data = err.response?.data;
      const firstError = data && typeof data === "object"
        ? Object.values(data).flat().join(" ")
        : null;
      setProfileError(firstError || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    setIsEditingProfile(false);
    setProfileError("");
    setProfileForm({
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
    });
  };

  const getLinksByRole = () => {
    const role = user?.role;

    if (role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Pending Users", href: "/admin/pending-users", icon: Users },
        { name: "Medicines", href: "/admin/medicines", icon: Pill },
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
        { name: "Browse Medicines", href: "/buyer/medicines", icon: Pill },
        { name: "Order History", href: "/buyer/orders", icon: ShoppingCart },
        { name: "Track Deliveries", href: "/buyer/deliveries", icon: Truck },
        { name: "Suppliers", href: "/buyer/suppliers", icon: Store },
        { name: "Invoices", href: "/buyer/invoices", icon: FileText },
        { name: "Wishlist", href: "/buyer/wishlist", icon: Heart },
        
      ];
    }
    return [];
  };

  const links = getLinksByRole();

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-50 ${isDarkMode ? 'dark:bg-slate-950' : ''}`}>
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-slate-900/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 h-screen flex-shrink-0 border-r bg-white transition-transform dark:bg-slate-900 md:relative md:z-auto ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
      }`}>
        <div className="h-full min-h-0 flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen((open) => !open)}
                title="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HiMed</span>
              </Link>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 min-h-0 px-4 py-6 space-y-1 overflow-y-auto">
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
                  {link.href === "/buyer/wishlist" && wishlistItems.length > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  username: user?.username || "",
                  email: user?.email || "",
                  phone_number: user?.phone_number || "",
                });
                setIsProfileOpen(true);
              }}
              className="mb-4 flex w-full items-center space-x-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold uppercase">
                {user?.username?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username}</span>
                <span className="text-xs text-slate-500 uppercase">{user?.role}</span>
              </div>
            </button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link to="/" className={`items-center space-x-2 ${isSidebarOpen ? "hidden md:hidden" : "flex"}`}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  event.preventDefault();
                  setIsSidebarOpen(true);
                }}
                title="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">HiMed</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {user?.role === "buyer" && (
              <Link
                to="/buyer/cart"
                className={`relative p-2 rounded-full transition-colors ${
                  location.pathname === "/buyer/cart"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

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
        <main className="flex-1 min-h-0 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xl font-bold uppercase">
                  {user?.username?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user?.username}</h2>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                  <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase text-primary">
                    {user?.role}
                  </span>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={closeProfile}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {profileError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {profileError}
              </div>
            )}

            {!isEditingProfile ? (
              <div className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Username</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{user?.username || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{user?.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{user?.phone_number || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                    <Shield className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="font-semibold capitalize text-slate-900 dark:text-white">{user?.role || "-"}</p>
                    </div>
                  </div>
                </div>
                <Button type="button" className="w-full" onClick={() => setIsEditingProfile(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-username">Username</Label>
                  <Input
                    id="profile-username"
                    value={profileForm.username}
                    onChange={(event) => setProfileForm({ ...profileForm, username: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone_number}
                    onChange={(event) => setProfileForm({ ...profileForm, phone_number: event.target.value })}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="button" onClick={handleProfileSave} disabled={isSavingProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSavingProfile ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSavingProfile}
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileError("");
                      setProfileForm({
                        username: user?.username || "",
                        email: user?.email || "",
                        phone_number: user?.phone_number || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
