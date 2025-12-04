import { Column, Action } from '@share/components/table/DataTable.types'
import { LoanTypeTableItem } from '../models/loanTypesModel'

// Helper para formatear dinero
const formatMoney = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Componente para el badge de estado activo/inactivo
const ActiveBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      isActive 
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    }`}>
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
};

export const loanTypeColumns: Column<LoanTypeTableItem>[] = [
  {
    field: 'name',
    header: 'Nombre',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {row.name}
      </div>
    )
  },
  {
    field: 'description',
    header: 'Descripción',
    sortable: false,
    render: (row) => (
      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={row.description}>
        {row.description}
      </div>
    )
  },
  {
    field: 'interestRate',
    header: 'Tasa Interés',
    sortable: true,
    width: '120px',
    render: (row) => (
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {row.interestRate}% <span className="text-xs text-gray-500">E.A.</span>
      </div>
    )
  },
  {
    field: 'minAmount',
    header: 'Monto Mínimo',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {formatMoney(row.minAmount)}
      </div>
    )
  },
  {
    field: 'maxAmount',
    header: 'Monto Máximo',
    sortable: true,
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {formatMoney(row.maxAmount)}
      </div>
    )
  },
  {
    field: 'minTerm',
    header: 'Plazo',
    sortable: true,
    width: '140px',
    render: (row) => (
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {row.minTerm} - {row.maxTerm} meses
      </div>
    )
  },
  {
    field: 'isActive',
    header: 'Estado',
    sortable: true,
    width: '100px',
    render: (row) => <ActiveBadge isActive={row.isActive} />
  }
]

export const getLoanTypeActions = (
  onEdit: (loanType: LoanTypeTableItem) => void,
  onDelete: (loanType: LoanTypeTableItem) => void
): Action<LoanTypeTableItem>[] => [
  {
    icon: 'pi pi-pencil',
    label: 'Editar',
    color: 'blue',
    onClick: onEdit
  },
  {
    icon: 'pi pi-trash',
    label: 'Eliminar',
    color: 'red',
    onClick: onDelete
  }
]

