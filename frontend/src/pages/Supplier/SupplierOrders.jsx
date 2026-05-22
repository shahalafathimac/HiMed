import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSupplierOrders, updateOrderStatus } from "../../services/apiServices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function SupplierOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["supplierOrders"],
    queryFn: async () => {
      const res = await fetchSupplierOrders();
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["supplierOrders"] })
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
      <h2 className="text-3xl font-bold tracking-tight">Order Fulfillment</h2>
      <Card>
        <CardHeader>
          <CardTitle>Received Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Update Status</TableHead>
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
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No orders received yet.</TableCell>
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
                    <select 
                      className="text-sm border rounded-md p-1 bg-white focus:ring-primary focus:border-primary disabled:opacity-50"
                      value={order.status}
                      disabled={order.status === 'cancelled' || order.status === 'delivered' || updateMutation.isPending}
                      onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
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
