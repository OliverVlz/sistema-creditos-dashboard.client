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
    render: (row) =>
      row.isRedirectEnabled && row.targetUrl ? (
        <a
          href={row.targetUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-global-12 hover:underline"
        >
          <svg className="w-6 h-6 text-global-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          <span className="max-w-[220px] truncate">{row.targetUrl}</span>
        </a>
      ) : (
        'Deshabilitada'
      ),
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
  onDelete: (item: Advertisement) => void
  onToggleStatus: (item: Advertisement) => void
  onMoveUp: (item: Advertisement) => void
  onMoveDown: (item: Advertisement) => void
}

export const getAdvertisingActions = ({
  onEdit,
  onDelete,
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
    icon: 'pi pi-trash',
    label: 'Eliminar',
    color: 'red',
    onClick: onDelete,
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
