import { Column, Action } from '@share/components/table/DataTable.types'

export interface Client {
  id: number
  firstName: string
  lastName: string
  documentType: 'CC' | 'CE' | 'PA'
  documentNumber: string
  email: string
  phone: string
  branch: string
  rank: string
  status: 'active' | 'inactive' | 'suspended'
  registrationDate: string
  loansCount: number
}

export const StatusBadge = ({ status }: { status: Client['status'] }) => {
  const config = {
    active: { color: 'green', label: 'Activo' },
    inactive: { color: 'gray', label: 'Inactivo' },
    suspended: { color: 'red', label: 'Suspendido' }
  }

  const { color, label } = config[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      <div className={`w-1.5 h-1.5 bg-${color}-400 rounded-full mr-1.5`}></div>
      {label}
    </span>
  )
}

export const LoansIndicator = ({ count }: { count: number }) => {
  let colorClass = 'text-gray-600 bg-gray-50'
  if (count > 0) colorClass = 'text-blue-600 bg-blue-50'
  if (count > 2) colorClass = 'text-purple-600 bg-purple-50'

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${colorClass}`}>
      {count}
    </span>
  )
}

export const getBranchLabel = (branch: Client['branch']) => {
  const labels: Record<Client['branch'], string> = {
    ejercito: 'Ejército Nacional',
    armada: 'Armada Nacional',
    fuerza_aerea: 'Fuerza Aérea',
    policia: 'Policía Nacional',
    pensionado: 'Pensionado',
    otro: 'Otro'
  }
  return labels[branch]
}

export const clientColumns: Column<Client>[] = [
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
        {getBranchLabel(row.branch)}
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

// ========== CONFIGURACIÓN DE ACCIONES ==========

export const clientActions: Action<Client>[] = [
  {
    icon: 'pi pi-eye',
    label: 'Ver Detalles',
    color: 'blue',
    onClick: (client) => console.log('Ver cliente:', client.id)
  },
  {
    icon: 'pi pi-pencil',
    label: 'Editar',
    color: 'green',
    onClick: (client) => console.log('Editar cliente:', client.id),
    show: (client) => client.status !== 'suspended' // Solo si no está suspendido
  },
  {
    icon: 'pi pi-file-text',
    label: 'Ver Solicitudes',
    color: 'purple',
    onClick: (client) => console.log('Ver solicitudes:', client.id)
  },
  {
    icon: 'pi pi-ban',
    label: 'Suspender',
    color: 'red',
    onClick: (client) => console.log('Suspender:', client.id),
    show: (client) => client.status === 'active' // Solo si está activo
  }
]