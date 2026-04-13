import { Column, Action } from '@share/components/table/DataTable.types'
import { User } from '../models/usersTableConfig'
import { StatusBadge } from './usersTableBadges'
import { NavigateFunction } from 'react-router-dom';

export const userColumns: Column<User>[] = [
  
/*     {
      field: 'id',
      header: 'ID',
      headerIcon: 'pi pi-id-card',
      sortable: true,
      width: '80px',
      render: (row) => (
        <div className="w-auto p-2 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-medium">
          {row.id}
        </div>
      )
    }, */
    {
      field: 'documentNumber',
      header: 'Documento',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {row.documentNumber}
        </div>
      )
    },
    {
      field: 'firstName',
      header: 'Usuario',
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {row.firstName} {row.lastName}
          </div>
          {/* <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div> */}
        </div>
      )
    },

    {
      field: 'email',
      header: 'Email',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.email}</div>
      )
    },
    {
      field: 'phoneNumber',
      header: 'Teléfono',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.phoneNumber}</div>
      )
    },
    {
      field: 'role',
      header: 'Rol',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.role}</div>
      )
    },
    {
      field: 'isActive',
      header: 'Activo',
      sortable: true,
      render: (row) => <StatusBadge status={row.isActive} />
    }
  ]
  
export const getUserActions = (
  navigate: NavigateFunction,
  onToggleStatus: (user: User) => void,
  onSendPasswordRecovery: (user: User) => void,
  canManageUsers: boolean,
  isAdmin: boolean
): Action<User>[] => {
  const actions: Action<User>[] = []

  if (isAdmin) {
    actions.push({
      icon: 'pi pi-pencil',
      label: 'Editar',
      color: 'green',
      onClick: (user) => {
        navigate(`/gestion-de-usuarios/editar-usuario/${user.id}`);
      },
    })
  }

  if (canManageUsers) {
    actions.push({
      icon: 'pi pi-envelope',
      label: 'Enviar recuperación',
      color: 'blue',
      onClick: onSendPasswordRecovery,
      show: (targetUser) => Boolean(targetUser.email),
    })
  }

  if (isAdmin) {
    actions.push({
      icon: 'pi pi-times-circle',
      label: 'Desactivar',
      color: 'red',
      onClick: onToggleStatus,
      show: (user) => user.isActive,
    })
    actions.push({
      icon: 'pi pi-check-circle',
      label: 'Activar',
      color: 'blue',
      onClick: onToggleStatus,
      show: (user) => !user.isActive,
    })
  }

  return actions
}
