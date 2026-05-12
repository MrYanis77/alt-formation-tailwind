import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './Items/PageLoader';

export default function RequireAuth({ children, adminOnly = false, denyAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/accueil" replace />;
  }

  if (denyAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
