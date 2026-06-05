import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, fetchUser, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/connexion" state={{ from: location }} replace />;
  }

  return children;
}
