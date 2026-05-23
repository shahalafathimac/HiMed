import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoutes({ children }) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;