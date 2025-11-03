import { type ReactNode } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { LOGIN_ROUTE } from '../routes';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Temporalmente deshabilitado el sistema de autenticación
  // const { user } = useAuth();
  // const location = useLocation();

  // if (!user) {
  //   // Guardar la ruta a la que quería acceder para redireccionar después del login
  //   return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};
