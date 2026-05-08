import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type{ Role } from "../types";

interface RoleRouteProps {
  allowedRoles: Role[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;