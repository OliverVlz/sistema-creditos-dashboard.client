/**
 * Definición de roles del sistema
 * Estos roles determinan los permisos y accesos de los usuarios
 */

// Tipos de roles disponibles
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  ASESOR = 'ASESOR',
}

// Array de todos los roles (útil para validaciones)
export const ALL_ROLES = [UserRole.ADMIN, UserRole.CLIENTE, UserRole.ASESOR] as const;

// Tipo para roles permitidos en rutas
export type AllowedRoles = UserRole | UserRole[];

/**
 * Configuración de permisos por rol
 * Define qué puede hacer cada rol en el sistema
 */
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageClients: true,
    canManageCredits: true,
    canManageLoanRequests: true,
    canManageLoanTypes: true,
    canViewReports: true,
    canApproveLoans: true,
  },
  [UserRole.ASESOR]: {
    canManageUsers: false,
    canManageClients: true,
    canManageCredits: true,
    canManageLoanRequests: true,
    canManageLoanTypes: false,
    canViewReports: true,
    canApproveLoans: false,
  },
  [UserRole.CLIENTE]: {
    canManageUsers: false,
    canManageClients: false,
    canManageCredits: false,
    canManageLoanRequests: false, // Solo puede ver sus propias solicitudes
    canManageLoanTypes: false,
    canViewReports: false,
    canApproveLoans: false,
  },
} as const;

export type RolePermissions = typeof ROLE_PERMISSIONS[UserRole];

