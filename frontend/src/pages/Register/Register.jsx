import { useState } from "react";
import api from "../../api/axios";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "buyer",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/accounts/register/",
        formData
      );

      alert(
        response.data.message
      );

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert(
        "Registration Failed"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 shadow-lg rounded-lg bg-white"
      >

        <h2 className="text-2xl font-bold mb-4">
          Register
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border w-full p-2 mb-3"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border w-full p-2 mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border w-full p-2 mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          className="border w-full p-2 mb-3"
          onChange={handleChange}
        />

        <select
          name="role"
          className="border w-full p-2 mb-3"
          onChange={handleChange}
        >

          <option value="buyer">
            Buyer
          </option>

          <option value="supplier">
            Supplier
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        <button
          type="submit"
          className="
          bg-blue-500
          text-white
          px-4
          py-2
          rounded
          w-full
          "
        >
          Register
        </button>

      </form>

    </div>

  );
}

export default Register;