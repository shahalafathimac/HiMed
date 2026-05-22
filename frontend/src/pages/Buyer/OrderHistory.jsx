import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBuyerOrders, cancelOrder } from "../../services/apiServices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function OrderHistory() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["buyerOrders"],
    queryFn: async () => {
      const res = await fetchBuyerOrders();
      return res.data;
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: () => queryClient.invalidateQueries(["buyerOrders"])
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'confirmed': return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'shipped': return <Badge className="bg-indigo-100 text-indigo-800">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Order History</h2>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading orders...</TableCell>
                </TableRow>
              )}
              {!isLoading && orders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">You have not placed any orders yet.</TableCell>
                </TableRow>
              )}
              {!isLoading && orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.medicine}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell className="font-semibold text-slate-700">${order.total_price}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    {order.status === 'pending' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this order?")) {
                            cancelMutation.mutate(order.id);
                          }
                        }}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
