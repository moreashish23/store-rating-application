import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-64 space-y-3">
          <Skeleton height={40} borderRadius={12} />
          <Skeleton height={20} borderRadius={8} />
          <Skeleton height={20} width="80%" borderRadius={8} />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;