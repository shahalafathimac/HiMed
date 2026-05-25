import { useState, useEffect } from "react";
import {
  fetchMedicinesList,
  fetchDashboardData,
  createMedicine,
  deleteMedicine,
  placeOrder
} from "../../services/apiServices";
import Navbar from "../../components/Navbar/Navbar";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", description: "", stock: "", price: "", expiry_date: "" });
  const [orderQuantity, setOrderQuantity] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashRes, medRes] = await Promise.all([
        fetchDashboardData(),
        fetchMedicinesList()
      ]);
      setRole(dashRes.data.role);
      setMedicines(medRes.data);
    } catch (error) {
      console.error("Error loading medicines data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await createMedicine(newMed);
      setShowAddForm(false);
      setNewMed({ name: "", description: "", stock: "", price: "", expiry_date: "" });
      loadData();
    } catch (err) {
  console.error("Error adding medicine", err);

  console.log(
    "BACKEND ERROR:",
    err.response?.data
  );

  alert(
    JSON.stringify(
      err.response?.data,
      null,
      2
    )
  );
}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      loadData();
    } catch (err) {
      console.error("Error deleting medicine", err);
      alert("Failed to delete medicine");
    }
  };

  const handleBuy = async (id) => {
    const qty = orderQuantity[id] || 1;
    try {
      await placeOrder({ medicine_id: id, quantity: qty });
      alert("Order placed successfully!");
      loadData();
    } catch (err) {
      console.error("Error placing order", err);
      alert(err.response?.data?.message || "Failed to place order");
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Medicines</h1>
          {role === "supplier" && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors"
            >
              {showAddForm ? "Cancel" : "Add Medicine"}
            </button>
          )}
        </div>

        {showAddForm && role === "supplier" && (
          <form onSubmit={handleAddMedicine} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" required value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} className="border p-3 rounded" />
            <input type="number" placeholder="Price" required value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} className="border p-3 rounded" />
            <input type="number" placeholder="Stock" required value={newMed.stock} onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })} className="border p-3 rounded" />
            <input type="date" placeholder="Expiry Date" required value={newMed.expiry_date} onChange={(e) => setNewMed({ ...newMed, expiry_date: e.target.value })} className="border p-3 rounded" />
            <textarea placeholder="Description" required value={newMed.description} onChange={(e) => setNewMed({ ...newMed, description: e.target.value })} className="border p-3 rounded md:col-span-2" />
            <div className="md:col-span-2 text-right">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">Save Medicine</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                    ₹{Number(med.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{med.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    Stock:
                    <span className={med.stock < 10 ? "text-red-500 font-bold ml-1" : "ml-1"}>
                      {med.stock}
                    </span>
                  </p>

                  {med.stock < 10 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        ⚠ Low Stock
                      </span>
                    </div>
                  )}

                  <p className="mt-2">
                    Expires: {med.expiry_date}
                  </p>
                </div>
                {role === "supplier" ? (
                  <div className="flex space-x-2 mt-4">
                    <button onClick={() => handleDelete(med.id)} className="w-full bg-red-100 text-red-600 hover:bg-red-200 py-2 rounded font-medium transition-colors">
                      Delete
                    </button>
                  </div>
                ) : role === "buyer" ? (
                  <div className="flex space-x-2 mt-4 items-center">
                    <input
                      type="number"
                      min="1"
                      max={med.stock}
                      value={orderQuantity[med.id] || 1}
                      onChange={(e) => setOrderQuantity({ ...orderQuantity, [med.id]: e.target.value })}
                      className="border rounded w-20 p-2 text-center"
                    />
                    <button
                      onClick={() => handleBuy(med.id)}
                      disabled={med.stock < 1}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 py-2 rounded font-medium transition-colors"
                    >
                      {med.stock < 1 ? "Out of Stock" : "Buy Now"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {medicines.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No medicines available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Medicines;