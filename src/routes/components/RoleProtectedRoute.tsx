import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { AllowedRoles } from '../../types/roles';

interface RoleProtectedRouteProps {
  children: ReactNode;
  /** Roles permitidos para acceder a la ruta */
  allowedRoles: AllowedRoles;
  /** Ruta a la que redirigir si no tiene acceso (default: /unauthorized) */
  redirectTo?: string;
}

/**
 * Componente Guard para proteger rutas basándose en roles
 * Primero verifica autenticación, luego verifica que el usuario tenga el rol permitido
 * 
 * @example
 * // Solo ADMIN puede acceder
 * <RoleProtectedRoute allowedRoles={UserRole.ADMIN}>
 *   <AdminPage />
 * </RoleProtectedRoute>
 * 
 * @example
 * // ADMIN y ASESOR pueden acceder
 * <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR]}>
 *   <ManagementPage />
 * </RoleProtectedRoute>
 */
export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/home'
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasRole } = useRoleAccess();
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
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero no tiene el rol permitido
  if (!hasRole(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

