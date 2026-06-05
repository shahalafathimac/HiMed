import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  placeOrder, 
  fetchOrderHistory, 
  cancelOrder,
  fetchSupplierOrders,
  fetchAdminOrders,
  updateOrderStatus,
} from "../services/apiServices";

export const useOrders = () => {
  const queryClient = useQueryClient();
  
  // Get buyer order history
  const { data: buyerOrders = [], isLoading: buyerOrdersLoading } = useQuery({
    queryKey: ["buyerOrders"],
    queryFn: fetchOrderHistory,
  });
  
  // Get supplier orders
  const { data: supplierOrders = [], isLoading: supplierOrdersLoading } = useQuery({
    queryKey: ["supplierOrders"],
    queryFn: fetchSupplierOrders,
  });
  
  // Get admin orders
  const { data: adminOrders = [], isLoading: adminOrdersLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchAdminOrders,
  });
  
  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["supplierOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });
  
  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["supplierOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["supplierOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });
  
  return {
    // Data
    buyerOrders,
    supplierOrders,
    adminOrders,
    
    // Loading states
    buyerOrdersLoading,
    supplierOrdersLoading,
    adminOrdersLoading,
    
    // Mutations
    placeOrder: placeOrderMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    isPlacing: placeOrderMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
  };
};

export default useOrders;
