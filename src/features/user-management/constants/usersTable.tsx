import { Column, Action } from '@share/components/table/DataTable.types'
import { User } from '../models/usersTableConfig'
import { StatusBadge } from './usersTableBadges'

export const userColumns: Column<User>[] = [
    {
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
    },
    {
      field: 'firstName',
      header: 'Cliente',
      headerIcon: 'pi pi-user',
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
        </div>
      )
    },
    {
      field: 'documentType',
      header: 'Documento',
      headerIcon: 'pi pi-id-card',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {row.documentType} - {row.documentNumber}
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
  
  export const userActions: Action<User>[] = [
    {
      icon: 'pi pi-eye',
      label: 'Ver Detalles',
      color: 'blue',
      onClick: (user) => console.log('Ver usuario:', user.id)
    },
    {
      icon: 'pi pi-pencil',
      label: 'Editar',
      color: 'green',
      onClick: (user) => console.log('Editar usuario:', user.id),
      /* show: (client) => client.status !== 'Rechazado' */
    },
    {
      icon: 'pi pi-list',
      label: 'Ver Solicitudes',
      color: 'purple',
      onClick: (user) => console.log('Ver solicitudes:', user.id)
    },
    {
      icon: 'pi pi-ban',
      label: 'Suspender',
      color: 'red',
      onClick: (user) => console.log('Suspender:', user.id),
      /* show: (user) => user.status === 'active' */
    }
  ]