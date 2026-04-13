import { ReactNode } from 'react';
import {
  GridIcon,
  UserCircleIcon,
  TaskIcon,
  DollarLineIcon,
  BoxCubeIcon,
} from '../icons';
import { UserRole } from '../types/roles';

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  /** Roles que pueden ver este item. Si está vacío, todos los roles autenticados pueden verlo */
  allowedRoles?: UserRole[];
  subItems?: {
    name: string;
    path: string;
    /** Roles que pueden ver este subitem */
    allowedRoles?: UserRole[];
  }[];
};

/**
 * Configuración de los items del sidebar
 * Cada item puede tener roles permitidos. Si no se especifica, todos los roles pueden verlo.
 */
export const sidebarMenuItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Inicio',
    path: '/dashboard/inicio',
  },
  {
    icon: <TaskIcon />,
    name: 'Gestión',
    subItems: [
      {
        name: 'Gestión de solicitudes',
        path: '/gestion-solicitudes',
        allowedRoles: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE],
      },
      {
        name: 'Gestión de clientes',
        path: '/gestion-de-clientes',
        allowedRoles: [UserRole.ADMIN, UserRole.ASESOR],
      },
      {
        name: 'Gestión de usuarios',
        path: '/dashboard/gestion-de-usuarios',
        allowedRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    icon: <DollarLineIcon />,
    name: 'Créditos',
    subItems: [
      {
        name: 'Calculadora',
        path: '/dashboard/simulation',
        allowedRoles: [UserRole.ADMIN, UserRole.ASESOR],
      },
      {
        name: 'Solicitar crédito',
        path: '/dashboard/gestion-de-creditos',
        allowedRoles: [UserRole.CLIENTE],
      },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: 'Configuración',
    subItems: [
      {
        name: 'Tipos de préstamo',
        path: '/tipos-prestamo',
        allowedRoles: [UserRole.ADMIN],
      },
      {
        name: 'Gestión de publicidad',
        path: '/dashboard/gestion-publicidad',
        allowedRoles: [UserRole.ADMIN, UserRole.ASESOR],
      },
      {
        name: 'Carga masiva',
        path: '/gestion-de-clientes/carga-masiva',
        allowedRoles: [UserRole.ADMIN, UserRole.ASESOR],
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: 'Mi perfil',
    path: '/dashboard/mi-perfil',
    allowedRoles: [UserRole.CLIENTE],
  },
];

/**
 * Filtra los items del menú según el rol del usuario
 * @param items - Items del menú a filtrar
 * @param userRole - Rol del usuario actual
 * @returns Items filtrados según los permisos del rol
 */
export const filterMenuItemsByRole = (
  items: NavItem[],
  userRole: UserRole | null
): NavItem[] => {
  if (!userRole) return [];

  return items
    .filter((item) => {
      // Si no hay roles especificados, el item es visible para todos
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }
      // Verificar si el rol del usuario está en los roles permitidos
      return item.allowedRoles.includes(userRole);
    })
    .map((item) => {
      // Si tiene subitems, también filtrarlos por rol
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) => {
          if (!subItem.allowedRoles || subItem.allowedRoles.length === 0) {
            return true;
          }
          return subItem.allowedRoles.includes(userRole);
        });

        return {
          ...item,
          subItems: filteredSubItems,
        };
      }
      return item;
    })
    // Eliminar items que quedaron sin subitems (si tenían)
    .filter((item) => {
      if (item.subItems && item.subItems.length === 0) {
        return false;
      }
      return true;
    });
};

/**
 * Hook helper para usar en componentes que necesitan items filtrados
 * Se usa dentro del AppSidebar
 */
export const getFilteredMenuItems = (userRole: UserRole | null): NavItem[] => {
  return filterMenuItemsByRole(sidebarMenuItems, userRole);
};

