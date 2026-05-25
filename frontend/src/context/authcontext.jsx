import { createContext, useState, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookies";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [token, setToken] = useState(
    getCookie("access_token") || null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!getCookie("access_token")
  );

  const login = (accessToken) => {
    setCookie("access_token", accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie("access_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const storedToken = getCookie("access_token");
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
