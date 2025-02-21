
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
