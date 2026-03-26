import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth.js';

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user?.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ?? <Outlet />;
}
