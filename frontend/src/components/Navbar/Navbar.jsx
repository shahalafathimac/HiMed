function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          HIMED
        </h1>

        <ul className="flex gap-6">
          <li>Home</li>
          <li>Medicines</li>
          <li>Orders</li>
          <li>Dashboard</li>
          <li>Contact Us</li>
        </ul>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded">
            Login
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Register
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;