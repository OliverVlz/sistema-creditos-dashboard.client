import { Action, Column } from '@share/components/table/DataTable.types'
import { Advertisement } from '../models/advertisingModel'

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleDateString('es-CO')
}

const ActiveBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      isActive
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    }`}
  >
    {isActive ? 'Activa' : 'Inactiva'}
  </span>
)

export const advertisingColumns: Column<Advertisement>[] = [
  {
    field: 'title',
    header: 'Título',
    sortable: true,
    render: (row) => <span className="font-semibold">{row.title}</span>,
  },
  {
    field: 'imageUrl',
    header: 'Imagen',
    sortable: false,
    render: (row) => (
      <img
        src={row.imageUrl}
        alt={row.title}
        className="h-12 w-20 rounded-md object-cover border border-gray-200 dark:border-gray-700"
      />
    ),
  },
  {
    field: 'targetUrl',
    header: 'Redirección',
    sortable: false,
    render: (row) => (row.isRedirectEnabled ? row.targetUrl || '-' : 'Deshabilitada'),
  },
  {
    field: 'sortOrder',
    header: 'Orden',
    sortable: true,
    width: '90px',
    align: 'center',
  },
  {
    field: 'isActive',
    header: 'Estado',
    sortable: true,
    width: '110px',
    render: (row) => <ActiveBadge isActive={row.isActive} />,
  },
  {
    field: 'startsAt',
    header: 'Vigencia',
    sortable: false,
    render: (row) => (
      <span>
        {formatDate(row.startsAt)} - {formatDate(row.endsAt)}
      </span>
    ),
  },
]

interface AdvertisingActionsArgs {
  onEdit: (item: Advertisement) => void
  onHistory: (item: Advertisement) => void
  onToggleStatus: (item: Advertisement) => void
  onMoveUp: (item: Advertisement) => void
  onMoveDown: (item: Advertisement) => void
}

export const getAdvertisingActions = ({
  onEdit,
  onHistory,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
}: AdvertisingActionsArgs): Action<Advertisement>[] => [
  {
    icon: 'pi pi-pencil',
    label: 'Editar',
    color: 'blue',
    onClick: onEdit,
  },
  {
    icon: 'pi pi-history',
    label: 'Histórico',
    color: 'purple',
    onClick: onHistory,
  },
  {
    icon: 'pi pi-chevron-up',
    label: 'Subir',
    color: 'gray',
    onClick: onMoveUp,
  },
  {
    icon: 'pi pi-chevron-down',
    label: 'Bajar',
    color: 'gray',
    onClick: onMoveDown,
  },
  {
    icon: 'pi pi-power-off',
    label: 'Activar/Desactivar',
    color: 'green',
    onClick: onToggleStatus,
  },
]
