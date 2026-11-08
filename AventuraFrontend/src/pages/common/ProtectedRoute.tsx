import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles,
}: Props) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) 
  {
    return null;
  }

  if (!isAuthenticated || user === null) 
  {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userRole ?? "")) 
  {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}