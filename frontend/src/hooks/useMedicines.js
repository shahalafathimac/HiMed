import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchMedicinesList, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  fetchLowStockMedicines,
  fetchMedicineAnalytics
} from "../services/apiServices";

export const useMedicines = () => {
  const queryClient = useQueryClient();
  
  // Get supplier medicines
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ["supplierMedicines"],
    queryFn: fetchMedicinesList,
  });
  
  // Get public medicines (for catalog)
  const { data: publicMedicines = [], isLoading: publicMedicinesLoading } = useQuery({
    queryKey: ["publicMedicines"],
    queryFn: fetchMedicinesList,
  });
  
  // Get low stock medicines (for supplier dashboard)
  const { data: lowStockMedicines = [], isLoading: lowStockLoading } = useQuery({
    queryKey: ["lowStockMedicines"],
    queryFn: fetchLowStockMedicines,
  });
  
  // Get medicine analytics (for supplier dashboard)
  const { data: medicineAnalytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["medicineAnalytics"],
    queryFn: fetchMedicineAnalytics,
  });
  
  // Create medicine mutation
  const createMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["publicMedicines"] });
    },
  });
  
  // Update medicine mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMedicine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["publicMedicines"] });
    },
  });
  
  // Delete medicine mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["publicMedicines"] });
    },
  });
  
  return {
    // Data
    medicines,
    publicMedicines,
    lowStockMedicines,
    medicineAnalytics,
    
    // Loading states
    medicinesLoading,
    publicMedicinesLoading,
    lowStockLoading,
    analyticsLoading,
    
    // Mutations
    createMedicine: createMutation.mutate,
    updateMedicine: updateMutation.mutate,
    deleteMedicine: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export default useMedicines;
