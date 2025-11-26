import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente Guard para proteger rutas privadas
 * Redirige al login si el usuario no está autenticado
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8546]"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  // Guardar la ruta actual para redirigir después del login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
