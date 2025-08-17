import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const PrivateRoute = () => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;