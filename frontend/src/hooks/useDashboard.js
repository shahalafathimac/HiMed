import { useQuery } from "@tanstack/react-query";
import { 
  fetchDashboardData,
  fetchLowStockMedicines,
  fetchMedicineAnalytics
} from "../services/apiServices";
import { useAuthStore } from "../store/useAuthStore";

export const useDashboard = () => {
  const { updateUser, user } = useAuthStore();

  // Get dashboard data (role, permissions)
  const { data: dashboardInfo = null, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  // Get low stock medicines (for supplier)
  const { data: lowStockMedicines = [], isLoading: lowStockLoading } = useQuery({
    queryKey: ["lowStockMedicines"],
    queryFn: fetchLowStockMedicines,
  });

  // Get medicine analytics (for supplier)
  const { data: medicineAnalytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["medicineAnalytics"],
    queryFn: fetchMedicineAnalytics,
  });

  // Enrich the Zustand user object with role and username from backend
  // This runs whenever dashboardInfo changes
  // Note: We use a useEffect inside the component that uses this hook
  // since hooks can't contain other hooks conditionally

  return {
    // Data
    dashboardInfo,
    lowStockMedicines,
    medicineAnalytics,
    
    // Derived values
    role: dashboardInfo?.role,
    isAuthenticated: !!dashboardInfo,
    lowStockCount: lowStockMedicines?.length || 0,
    
    // Loading states
    isLoading: dashboardLoading || lowStockLoading || analyticsLoading,
    dashboardLoading,
    lowStockLoading,
    analyticsLoading,
  };
};

export default useDashboard;