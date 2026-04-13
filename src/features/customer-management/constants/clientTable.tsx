import { Column, Action } from '@share/components/table/DataTable.types'
import { Client } from '../models/clientsTableModel'
import { StatusBadge } from '@/features/user-management/constants/usersTableBadges'
import { NavigateFunction } from 'react-router-dom'

export const clientColumns: Column<Client>[] = [
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
      field: 'fullName',
      header: 'Usuario',
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {row.fullName}
          </div>
          {/* <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div> */}
        </div>
      )
    },
    {
      field: 'organization',
      header: 'Organización',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.organization?.name}</div>
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
      field: 'employmentStatus',
      header: 'Estado Laboral',
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.employmentStatus}</div>
      )
    },
    {
      field: 'isActive',
      header: 'Activo',
      sortable: true,
      render: (row) => <StatusBadge status={row.isActive} />
    }
  ]
  
  export const getClientActions = (
    navigate: NavigateFunction,
    onToggleStatus: (client: Client) => void,
    onDelete: (client: Client) => void,
    isAdmin: boolean
  ): Action<Client>[] => {
    const actions: Action<Client>[] = []

    if (isAdmin) {
      actions.push({
        icon: 'pi pi-pencil',
        label: 'Editar',
        color: 'green',
        onClick: (client) => navigate(`/gestion-de-clientes/editar-cliente/${client.id}`),
      })
      actions.push({
        icon: 'pi pi-times-circle',
        label: 'Desactivar',
        color: 'red',
        onClick: onToggleStatus,
        show: (client) => client.isActive,
      })
      actions.push({
        icon: 'pi pi-check-circle',
        label: 'Activar',
        color: 'blue',
        onClick: onToggleStatus,
        show: (client) => !client.isActive,
      })
      actions.push({
        icon: 'pi pi-trash',
        label: 'Eliminar',
        color: 'red',
        onClick: onDelete,
      })
    }

    return actions
  }
