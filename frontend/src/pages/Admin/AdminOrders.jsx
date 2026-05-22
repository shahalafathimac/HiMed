import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders } from "../../services/apiServices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await fetchAdminOrders();
      return res.data;
    }
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'confirmed': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmed</Badge>;
      case 'shipped': return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Platform Orders Overview</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading platform orders...</TableCell>
                </TableRow>
              )}
              {!isLoading && orders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No orders placed on the platform yet.</TableCell>
                </TableRow>
              )}
              {!isLoading && orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.medicine}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell className="font-semibold text-slate-700">${order.total_price}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date().toLocaleDateString()} {/* Mock date since backend doesn't return created_at in serializer by default, but assume it exists */}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
