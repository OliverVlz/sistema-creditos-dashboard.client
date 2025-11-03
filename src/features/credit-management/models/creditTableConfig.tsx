import { Column, Action } from '@share/components/table/DataTable.types'
import { StatusBadge, LoansIndicator } from './creditTableBadges'

export interface Credit {
  id: number
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  email: string
  phone: string
  branch: string
  rank: string
  status: string
  registrationDate: string
  loansCount: number
}

export const creditColumns: Column<Credit>[] = [
  {
    field: 'id',
    header: 'ID',
    headerIcon: 'pi pi-id-card',
    sortable: true,
    width: '80px',
    render: (row) => (
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-sm font-medium">
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
        <div className="text-sm font-semibold text-gray-900">
          {row.firstName} {row.lastName}
        </div>
        <div className="text-xs text-gray-500">{row.email}</div>
      </div>
    )
  },
  {
    field: 'documentType',
    header: 'Documento',
    headerIcon: 'pi pi-id-card',
    sortable: true,
    render: (row) => (
      <div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          {row.documentType}
        </span>
        <div className="text-xs text-gray-500 mt-1">{row.documentNumber}</div>
      </div>
    )
  },
  {
    field: 'branch',
    header: 'Fuerza/Entidad',
    headerIcon: 'pi pi-shield',
    sortable: true,
    render: (row) => (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
        {/* {getBranchLabel(row.branch)} */}
        {row.branch}
      </span>
    )
  },
  {
    field: 'rank',
    header: 'Rango',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-medium text-gray-900">{row.rank}</div>
    )
  },
  {
    field: 'loansCount',
    header: 'Préstamos',
    sortable: true,
    align: 'center',
    render: (row) => <LoansIndicator count={row.loansCount} />
  },
  {
    field: 'status',
    header: 'Estado',
    sortable: false,
    align: 'center',
    render: (row) => <StatusBadge status={row.status} />
  }
]

export const creditActions: Action<Credit>[] = [
  {
    icon: 'pi pi-eye',
    label: 'Ver Detalles',
    color: 'blue',
    onClick: (credit) => console.log('Ver crédito:', credit.id)
  },
  {
    icon: 'pi pi-pencil',
    label: 'Editar',
    color: 'green',
    onClick: (credit) => console.log('Editar crédito:', credit.id),
    /* show: (client) => client.status !== 'Rechazado' */
  },
  {
    icon: 'pi pi-list',
    label: 'Ver Solicitudes',
    color: 'purple',
    onClick: (credit) => console.log('Ver solicitudes:', credit.id)
  },
  {
    icon: 'pi pi-ban',
    label: 'Suspender',
    color: 'red',
    onClick: (credit) => console.log('Suspender:', credit.id),
    /* show: (user) => user.status === 'active' */
  }
]