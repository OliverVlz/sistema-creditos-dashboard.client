import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, ROLE_PERMISSIONS, AllowedRoles } from '../types/roles';

/**
 * Hook para verificar accesos y permisos basados en roles
 * Proporciona utilidades para verificar si el usuario tiene acceso a ciertas funcionalidades
 */
export const useRoleAccess = () => {
  const { user, isAuthenticated } = useAuth();

  // Obtener el rol del usuario actual
  const userRole = useMemo(() => {
    if (!user?.role) return null;
    return user.role.toUpperCase() as UserRole;
  }, [user?.role]);

  /**
   * Verifica si el usuario tiene uno de los roles permitidos
   * @param allowedRoles - Rol único o array de roles permitidos
   */
  const hasRole = (allowedRoles: AllowedRoles): boolean => {
    if (!userRole) return false;

    if (Array.isArray(allowedRoles)) {
      return allowedRoles.some(role => role === userRole);
    }

    return allowedRoles === userRole;
  };

  /**
   * Verifica si el usuario tiene acceso a una ruta/funcionalidad
   * Si no se especifican roles, solo verifica autenticación
   * @param allowedRoles - Roles permitidos (opcional)
   */
  const hasAccess = (allowedRoles?: AllowedRoles): boolean => {
    if (!isAuthenticated) return false;
    if (!allowedRoles) return true; // Solo requiere autenticación
    return hasRole(allowedRoles);
  };

  /**
   * Obtiene los permisos del usuario actual
   */
  const permissions = useMemo(() => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return {
        canManageUsers: false,
        canManageClients: false,
        canManageCredits: false,
        canManageLoanRequests: false,
        canManageLoanTypes: false,
        canViewReports: false,
        canApproveLoans: false,
      };
    }
    return ROLE_PERMISSIONS[userRole];
  }, [userRole]);

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = userRole === UserRole.ADMIN;

  /**
   * Verifica si el usuario es asesor
   */
  const isAsesor = userRole === UserRole.ASESOR;

  /**
   * Verifica si el usuario es cliente
   */
  const isCliente = userRole === UserRole.CLIENTE;

  return {
    userRole,
    hasRole,
    hasAccess,
    permissions,
    isAdmin,
    isAsesor,
    isCliente,
    isAuthenticated,
  };
};

export default useRoleAccess;

