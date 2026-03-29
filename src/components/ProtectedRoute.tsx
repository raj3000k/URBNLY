import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProtectedRoute({ children }: any) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
