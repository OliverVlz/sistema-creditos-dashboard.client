import DataTable from '@share/components/table/DataTable'   
import { loanTypeColumns, getLoanTypeActions } from '../constants/loanTypesTable'
import { useAppSelector } from '../../../store/index'
import { LoanTypeTableItem } from '../models/loanTypesModel'

interface LoanTypesTableProps {
  onEdit: (loanType: LoanTypeTableItem) => void
}

export default function LoanTypesTable({ onEdit }: LoanTypesTableProps) {
  const { loanTypes, loading } = useAppSelector((state) => state.loanTypes)  

  return (
    <DataTable 
      data={loanTypes} 
      columns={loanTypeColumns}
      actions={getLoanTypeActions(onEdit)}
      itemsPerPage={10}
      defaultSortField="name"
      defaultSortOrder="asc"
      emptyMessage="No se encontraron tipos de préstamo"
      emptyIcon="pi pi-file"
      loading={loading}
      onSelectionChange={() => {}}
      selectable={false}
    />
  )
}

