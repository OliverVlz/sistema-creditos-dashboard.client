import { ReactNode } from 'react';
import {
  GridIcon,
  UserCircleIcon,
  TaskIcon,
  DollarLineIcon,
  ListIcon,
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
    path: '/home',
    // Todos los roles pueden ver el inicio
  },
  {
    icon: <UserCircleIcon />,
    name: 'Gestión de Usuarios',
    path: '/dashboard/gestion-de-usuarios',
    allowedRoles: [UserRole.ADMIN], // Solo ADMIN
  },
  {
    icon: <TaskIcon />,
    name: 'Gestión de Clientes',
    path: '/gestion-de-clientes',
    allowedRoles: [UserRole.ADMIN, UserRole.ASESOR], // ADMIN y ASESOR
  },
/*   {
    icon: <DollarLineIcon />,
    name: 'Gestión de Créditos',
    path: '/dashboard/gestion-de-creditos',
    allowedRoles: [UserRole.ADMIN, UserRole.ASESOR], // ADMIN y ASESOR
  }, */
  {
    icon: <ListIcon />, 
    name: 'Gestión de Solicitudes',
    path: '/gestion-solicitudes',
    allowedRoles: [UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE], // ADMIN y ASESOR
  },
  {
    icon: <DollarLineIcon />,
    name: 'Solicitar crédito',
    path: '/dashboard/gestion-de-creditos',
    allowedRoles: [UserRole.CLIENTE], // Solo CLIENTE
  },
  {
    icon: <BoxCubeIcon />,
    name: 'Tipos de Préstamo',
    path: '/tipos-prestamo',
    allowedRoles: [UserRole.ADMIN], // Solo ADMIN
  },
  {
    icon: <UserCircleIcon />,
    name: 'Mi Perfil',
    path: '/dashboard/mi-perfil',
    allowedRoles: [UserRole.CLIENTE],
    // Todos los roles pueden ver su perfil
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

