import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./store/useAuthStore";
import ProtectedRoutes from "./routes/ProtectedRoutes";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Landing from "./pages/Public/Landing";
import About from "./pages/Public/About";
import ContactPage from "./pages/Public/ContactPage";
import MedicinesCatalog from "./pages/Public/MedicinesCatalog";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import SetupMFA from "./pages/Auth/SetupMFA";
import VerifyMFA from "./pages/Auth/VerifyMFA";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";

// Admin Pages
import PendingUsers from "./pages/Admin/PendingUsers";
import AdminOrders from "./pages/Admin/AdminOrders";
import ContactMessages from "./pages/Admin/ContactMessages";

// Supplier Pages
import MyMedicines from "./pages/Supplier/MyMedicines";
import SupplierOrders from "./pages/Supplier/SupplierOrders";

// Buyer Pages
import OrderHistory from "./pages/Buyer/OrderHistory";

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route Guards
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
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/catalog" element={<MedicinesCatalog />} />
          </Route>

          {/* Auth Routes (no token needed) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-mfa" element={<SetupMFA />} />
          <Route path="/verify-mfa" element={<VerifyMFA />} />

          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            
            {/* Admin Routes */}
            <Route path="/admin/pending-users" element={<RoleRoute role="admin"><PendingUsers /></RoleRoute>} />
            <Route path="/admin/orders" element={<RoleRoute role="admin"><AdminOrders /></RoleRoute>} />
            <Route path="/admin/messages" element={<RoleRoute role="admin"><ContactMessages /></RoleRoute>} />
            
            {/* Supplier Routes */}
            <Route path="/supplier/medicines" element={<RoleRoute role="supplier"><MyMedicines /></RoleRoute>} />
            <Route path="/supplier/orders" element={<RoleRoute role="supplier"><SupplierOrders /></RoleRoute>} />

            {/* Buyer Routes */}
            <Route path="/buyer/orders" element={<RoleRoute role="buyer"><OrderHistory /></RoleRoute>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;