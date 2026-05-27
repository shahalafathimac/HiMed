import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./store/useAuthStore";
import ProtectedRoutes from "./routes/ProtectedRoutes";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Public/Landing";
import About from "./pages/Public/About";
import ContactPage from "./pages/Public/ContactPage";
import MedicinesCatalog from "./pages/Public/MedicinesCatalog";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import SetupMFA from "./pages/Auth/SetupMFA";
import VerifyMFA from "./pages/Auth/VerifyMFA";

import Dashboard from "./pages/Dashboard/Dashboard";
import Medicines from "./pages/Medicines/Medicines";
import MedicineDetails from "./pages/Medicines/MedicineDetails";

import PendingUsers from "./pages/Admin/PendingUsers";
import AdminOrders from "./pages/Admin/AdminOrders";
import ContactMessages from "./pages/Admin/ContactMessages";

import MyMedicines from "./pages/Supplier/MyMedicines";
import SupplierOrders from "./pages/Supplier/SupplierOrders";

import Cart from "./pages/Buyer/Cart";
import OrderHistory from "./pages/Buyer/OrderHistory";
import BuyerSuppliers from "./pages/Buyer/BuyerSuppliers";
import BuyerPlaceholder from "./pages/Buyer/BuyerPlaceholder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, mfaRequired } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (mfaRequired) return <Navigate to="/verify-mfa" />;
  return children;
};

const RoleRoute = ({ role, children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== role) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/catalog" element={<MedicinesCatalog />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-mfa" element={<SetupMFA />} />
          <Route path="/verify-mfa" element={<VerifyMFA />} />

          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
            <Route path="/admin/pending-users" element={<RoleRoute role="admin"><PendingUsers /></RoleRoute>} />
            <Route path="/admin/orders" element={<RoleRoute role="admin"><AdminOrders /></RoleRoute>} />
            <Route path="/admin/messages" element={<RoleRoute role="admin"><ContactMessages /></RoleRoute>} />
            <Route path="/supplier/medicines" element={<RoleRoute role="supplier"><MyMedicines /></RoleRoute>} />
            <Route path="/supplier/orders" element={<RoleRoute role="supplier"><SupplierOrders /></RoleRoute>} />
            <Route path="/buyer/medicines" element={<RoleRoute role="buyer"><Medicines /></RoleRoute>} />
            <Route path="/buyer/medicines/:id" element={<RoleRoute role="buyer"><MedicineDetails /></RoleRoute>} />
            <Route path="/buyer/cart" element={<RoleRoute role="buyer"><Cart /></RoleRoute>} />
            <Route path="/buyer/orders" element={<RoleRoute role="buyer"><OrderHistory /></RoleRoute>} />
            <Route path="/buyer/deliveries" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Track Deliveries" description="Track pending, processing, shipped, and out for delivery orders from your order history." /></RoleRoute>} />
            <Route path="/buyer/suppliers" element={<RoleRoute role="buyer"><BuyerSuppliers /></RoleRoute>} />
            <Route path="/buyer/invoices" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Invoices" description="Invoices for completed purchases will appear here." /></RoleRoute>} />
            <Route path="/buyer/wishlist" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Wishlist" description="Save medicines you want to order later." /></RoleRoute>} />
            <Route path="/buyer/notifications" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Notifications" description="Review order, delivery, and account notifications." /></RoleRoute>} />
            <Route path="/buyer/profile" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Profile" description="Manage your buyer profile details." /></RoleRoute>} />
            <Route path="/buyer/settings" element={<RoleRoute role="buyer"><BuyerPlaceholder title="Settings" description="Manage buyer preferences and dashboard settings." /></RoleRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
