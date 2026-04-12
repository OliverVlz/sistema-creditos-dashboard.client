import { UserRole } from '../types/roles';

// Rutas públicas
export const LANDING_ROUTE = '/';
export const LOGIN_ROUTE = '/login';
export const REGISTER_ROUTE = '/registro';
export const ABOUT_ROUTE = '/sobre-nosotros';
export const SERVICES_ROUTE = '/servicios';
export const CREDIT_POLICIES_ROUTE = '/politicas-credito';

export const TERMS_AND_CONDITIONS_ROUTE = '/terminos-y-condiciones';
export const PRIVACY_POLICY_ROUTE = '/politica-de-privacidad';

// Rutas de instituciones
export const EJERCITO_NACIONAL_ROUTE = '/ejercito-nacional';
export const ARMADA_NACIONAL_ROUTE = '/armada-nacional';
export const FUERZA_AERESPACIAL_ROUTE = '/fuerza-aeroespacial';
export const POLICIA_NACIONAL_ROUTE = '/policia-nacional';

// Rutas privadas
export const DASHBOARD_ROUTE = '/dashboard';
export const HOME_ROUTE = '/home';
export const SIMULATION_ROUTE = '/simulation';
export const CLIENTS_ROUTE = '/clients';

// Rutas de gestión de usuarios (solo ADMIN)
export const USER_MANAGEMENT_ROUTE = '/dashboard/gestion-de-usuarios';
export const CREATE_USER_ROUTE = '/dashboard/crear-usuario';
export const EDIT_USER_ROUTE = '/gestion-de-usuarios/editar-usuario';

// Rutas de gestión de clientes (ADMIN y ASESOR)
export const CUSTOMER_MANAGEMENT_ROUTE = '/gestion-de-clientes';
export const CREATE_CLIENT_ROUTE = '/gestion-de-clientes/crear-cliente';
export const EDIT_CLIENT_ROUTE = '/gestion-de-clientes/editar-cliente';
export const BULK_IMPORT_CLIENTS_LOANS_ROUTE =
  '/gestion-de-clientes/carga-masiva';

// Rutas de gestión de créditos (ADMIN y ASESOR)
export const CREDIT_MANAGEMENT_ROUTE = '/dashboard/gestion-de-creditos';

// Rutas de solicitudes (ADMIN, ASESOR y CLIENTE)
export const LOAN_REQUESTS_ROUTE = '/gestion-solicitudes';
export const LOAN_REQUEST_DETAIL_ROUTE = '/gestion-solicitudes/detalle';

// Rutas de tipos de préstamo (solo ADMIN)
export const LOAN_TYPES_ROUTE = '/tipos-prestamo';

// Rutas de cliente (solo CLIENTE)
export const MY_REQUESTS_ROUTE = '/mis-solicitudes';

// Ruta de perfil (todos los roles)
export const PROFILE_ROUTE = '/dashboard/mi-perfil';

// Ruta de cambio de contraseña (todos los roles autenticados)
export const CHANGE_PASSWORD_ROUTE = '/dashboard/cambiar-contrasena';

// Rutas de clientes (legacy)
export const CLIENTS_ROUTES = {
  ROOT: CLIENTS_ROUTE,
  LIST: `${CLIENTS_ROUTE}/list`,
  CREATE: `${CLIENTS_ROUTE}/create`,
  EDIT: (id: string) => `${CLIENTS_ROUTE}/${id}/edit`,
  DETAILS: (id: string) => `${CLIENTS_ROUTE}/${id}`,
} as const;

/**
 * Configuración de roles permitidos por ruta
 * Esto se puede usar para validar acceso en diferentes partes de la aplicación
 */
export const ROUTE_ROLES = {
  // Rutas solo para ADMIN
  [USER_MANAGEMENT_ROUTE]: [UserRole.ADMIN],
  [CREATE_USER_ROUTE]: [UserRole.ADMIN],
  [EDIT_USER_ROUTE]: [UserRole.ADMIN],
  [LOAN_TYPES_ROUTE]: [UserRole.ADMIN],
  
  // Rutas para ADMIN y ASESOR
  [CUSTOMER_MANAGEMENT_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  [CREATE_CLIENT_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  [EDIT_CLIENT_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  [BULK_IMPORT_CLIENTS_LOANS_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  [CREDIT_MANAGEMENT_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  [LOAN_REQUEST_DETAIL_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR],
  
  // Rutas solo para CLIENTE
  [MY_REQUESTS_ROUTE]: [UserRole.CLIENTE],
  
  // Rutas para todos los roles autenticados
  [LOAN_REQUESTS_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE],
  [HOME_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE],
  [PROFILE_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE],
  [CHANGE_PASSWORD_ROUTE]: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE],
} as const;
