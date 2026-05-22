import { Link } from "react-router-dom";

function Admin() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <hr />

      <h2>User Management</h2>

      <div>
        <button>Pending Users</button>
        <button>Approved Users</button>
        <button>Rejected Users</button>
      </div>

      <hr />

      <h2>Medicines</h2>

      <div>
        <Link to="/medicines">
          <button>View Medicines</button>
        </Link>
      </div>

      <hr />

      <h2>Orders</h2>

      <div>
        <Link to="/orders">
          <button>View Orders</button>
        </Link>
      </div>

      <hr />

      <h2>Contact Messages</h2>

      <div>
        <Link to="/contact">
          <button>View Messages</button>
        </Link>
      </div>
    </div>
  );
}

export default Admin;