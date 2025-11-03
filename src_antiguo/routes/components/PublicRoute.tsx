import { type ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { DASHBOARD_ROUTE } from '../routes';

interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute = ({ 
  children, 
  redirectIfAuthenticated: _redirectIfAuthenticated = false 
}: PublicRouteProps) => {
  // Temporalmente deshabilitado el sistema de autenticación
  // const { user } = useAuth();

  // if (user && redirectIfAuthenticated) {
  //   return <Navigate to={DASHBOARD_ROUTE} replace />;
  // }

  return <>{children}</>;
};
