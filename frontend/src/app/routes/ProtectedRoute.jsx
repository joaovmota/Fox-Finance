import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/fox";
import { useAuth } from "@/app/providers/AuthProvider";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="fox-page" data-testid="auth-loading-state"><Skeleton /><Skeleton className="fox-auth-loading-line" /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}