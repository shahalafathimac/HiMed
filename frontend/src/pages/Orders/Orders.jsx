import { useState, useEffect } from "react";
import { 
  fetchDashboardData, 
  fetchOrderHistory, 
  fetchSupplierOrders, 
  fetchAdminOrders, 
  cancelOrder, 
  updateOrderStatus 
} from "../../services/apiServices";
import Navbar from "../../components/Navbar/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dashRes = await fetchDashboardData();
      const userRole = dashRes.data.role;
      setRole(userRole);

      let ordersRes;
      if (userRole === "buyer") {
        ordersRes = await fetchOrderHistory();
      } else if (userRole === "supplier") {
        ordersRes = await fetchSupplierOrders();
      } else if (userRole === "admin") {
        ordersRes = await fetchAdminOrders();
      }
      
      if (ordersRes) {
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error("Error loading orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(id);
      loadData();
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, { status: newStatus });
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Orders</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.medicine}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">₹{Number(order.total_price).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {role === "buyer" && order.status === "pending" && (
                        <button onClick={() => handleCancel(order.id)} className="text-red-600 hover:text-red-900 transition-colors">
                          Cancel
                        </button>
                      )}
                      
                      {role === "supplier" && order.status !== "cancelled" && order.status !== "delivered" && (
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      )}

                      {role === "admin" && (
                        <span className="text-gray-400 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;