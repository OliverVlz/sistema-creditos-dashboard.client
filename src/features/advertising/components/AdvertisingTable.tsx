import DataTable from '@share/components/table/DataTable'
import { Advertisement } from '../models/advertisingModel'
import { advertisingColumns, getAdvertisingActions } from '../constants/advertisingTable'

interface AdvertisingTableProps {
  data: Advertisement[]
  loading: boolean
  onEdit: (item: Advertisement) => void
  onToggleStatus: (item: Advertisement) => void
  onMoveUp: (item: Advertisement) => void
  onMoveDown: (item: Advertisement) => void
}

export default function AdvertisingTable({
  data,
  loading,
  onEdit,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
}: AdvertisingTableProps) {
  return (
    <DataTable
      data={data}
      columns={advertisingColumns}
      actions={getAdvertisingActions({
        onEdit,
        onToggleStatus,
        onMoveUp,
        onMoveDown,
      })}
      itemsPerPage={10}
      defaultSortField="sortOrder"
      defaultSortOrder="asc"
      emptyMessage="No hay publicidad registrada"
      emptyIcon="pi pi-images"
      loading={loading}
      onSelectionChange={() => {}}
      selectable={false}
    />
  )
}
