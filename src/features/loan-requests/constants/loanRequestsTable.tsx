import { Column, Action } from '@share/components/table/DataTable.types'
import { LoanRequestTableItem } from '../models/loanRequestsModel'
import { NavigateFunction } from 'react-router-dom'

// Helper para formatear dinero
const formatMoney = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper para formatear fecha (formato corto)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Componente para el badge de estado
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aprobado':
        return { 
          bg: 'bg-green-100 dark:bg-green-900/30', 
          text: 'text-green-700 dark:text-green-400',
          label: 'Aprobado'
        };
      case 'rechazado':
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-700 dark:text-red-400',
          label: 'Rechazado'
        };
      case 'pendiente':
      default:
        return { 
          bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
          text: 'text-yellow-700 dark:text-yellow-400',
          label: 'Pendiente'
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const loanRequestColumns: Column<LoanRequestTableItem>[] = [
  {
    field: 'loanNumber',
    header: 'Nº préstamo',
    sortable: true,
    width: '140px',
    render: (row) => (
      <div className="text-sm font-semibold">
        {row.loanNumber}
      </div>
    )
  },
  {
    field: 'clientName',
    header: 'Solicitante',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {row.clientName}
      </div>
    )
  },
  {
    field: 'organizationName',
    header: 'Organización',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {row.organizationName}
      </div>
    )
  },
  {
    field: 'status',
    header: 'Estado',
    sortable: true,
    render: (row) => <StatusBadge status={row.status} />
  },
  {
    field: 'amountRequested',
    header: 'Monto',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {formatMoney(row.amountRequested)}
      </div>
    )
  },
  {
    field: 'termMonths',
    header: 'Plazo',
    sortable: true,
    width: '100px',
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {row.termMonths} meses
      </div>
    )
  },
  {
    field: 'appliedInterestRate',
    header: 'Interés',
    sortable: true,
    width: '100px',
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {row.appliedInterestRate}%
      </div>
    )
  },
  {
    field: 'createdAt',
    header: 'Fecha de Creación',
    sortable: true,
    width: '180px',
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {formatDate(row.createdAt)}
      </div>
    )
  }
]

export const getLoanRequestActions = (
  navigate: NavigateFunction,
  onDelete: (loan: LoanRequestTableItem) => void,
  isAdmin: boolean
): Action<LoanRequestTableItem>[] => {
  const actions: Action<LoanRequestTableItem>[] = [
    {
      icon: 'pi pi-eye',
      label: 'Ver Detalles',
      color: 'blue',
      onClick: (loan) => {
        navigate(`/gestion-solicitudes/detalle/${loan.id}`)
      }
    }
  ]

  if (isAdmin) {
    actions.push({
      icon: 'pi pi-trash',
      label: 'Eliminar',
      color: 'red',
      onClick: onDelete
    })
  }

  return actions
}

