// PublicRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./components/AuthProvider";

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
};
export default PublicRoute;
