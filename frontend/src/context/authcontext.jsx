import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("access") || null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  // Login Function
  const login = (accessToken) => {

    localStorage.setItem(
      "access",
      accessToken
    );

    setToken(accessToken);

    setIsAuthenticated(true);
  };

  // Logout Function
  const logout = () => {

    localStorage.removeItem("access");

    setToken(null);

    setIsAuthenticated(false);
  };

  useEffect(() => {

    const storedToken =
      localStorage.getItem("access");

    if (storedToken) {

      setToken(storedToken);

      setIsAuthenticated(true);

    }

  }, []);

  return (

    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}

export default AuthProvider;