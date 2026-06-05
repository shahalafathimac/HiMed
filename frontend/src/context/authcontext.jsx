import { useState } from "react";
import { AuthContext } from "./authContextValue";
import { getCookie, setCookie, removeCookie } from "../utils/cookies";

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
