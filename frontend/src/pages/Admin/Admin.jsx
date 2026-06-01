import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPendingUsers, approveUser, rejectUser, fetchDashboardData } from "../../services/apiServices";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const checkAdminAndLoadUsers = async () => {
    try {
      const dashRes = await fetchDashboardData();
      if (dashRes.data.role !== "admin") {
        navigate("/dashboard");
        return;
      }
      loadUsers();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetchPendingUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading pending users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      loadUsers();
    } catch (err) {
      alert("Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this user?")) return;
    try {
      await rejectUser(id);
      loadUsers();
    } catch (err) {
      alert("Failed to reject user");
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage users and oversee platform operations.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/admin/medicines" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg font-medium transition-colors">
              All Medicines
            </Link>
            <Link to="/admin/orders" className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg font-medium transition-colors">
              All Orders
            </Link>
            <Link to="/admin/messages" className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-lg font-medium transition-colors">
              Messages
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-700">Pending User Approvals</h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button 
                        onClick={() => handleApprove(user.id)} 
                        className="text-green-600 hover:text-green-900 transition-colors bg-green-50 hover:bg-green-100 px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(user.id)} 
                        className="text-red-600 hover:text-red-900 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No pending users found.
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

export default Admin;
