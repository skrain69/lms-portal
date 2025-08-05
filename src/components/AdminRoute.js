import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
