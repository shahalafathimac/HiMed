import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await api.post(
        "/accounts/login/",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      // Save JWT token
      localStorage.setItem(
        "access",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh_token
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (

    <div
      className="
      flex
      justify-center
      items-center
      min-h-screen
      bg-gray-100
      "
    >

      <form
        onSubmit={handleLogin}
        className="
        bg-white
        p-8
        rounded-lg
        shadow-md
        w-96
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-6
          text-center
          "
        >
          Login
        </h2>

        {error && (

          <p
            className="
            text-red-500
            mb-4
            "
          >
            {error}
          </p>

        )}

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          className="
          w-full
          border
          p-3
          mb-4
          rounded
          "
        />

        <input
          type="password"
          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          className="
          w-full
          border
          p-3
          mb-4
          rounded
          "
        />

        <button
          type="submit"
          className="
          w-full
          bg-blue-600
          text-white
          p-3
          rounded
          hover:bg-blue-700
          "
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;