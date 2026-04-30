import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute – Redirects unauthenticated users to /login.
 * Preserves the intended URL so the user can be redirected back after login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('splitsmart_user') || 'null');
      return user?.token || localStorage.getItem('token');
    } catch {
      return null;
    }
  })();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
