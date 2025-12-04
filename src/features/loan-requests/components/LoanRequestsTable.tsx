import DataTable from '@share/components/table/DataTable'   
import { loanRequestColumns, getLoanRequestActions } from '../constants/loanRequestsTable'
import { useAppSelector } from '../../../store/index'
import { useNavigate } from 'react-router-dom'

export default function LoanRequestsTable() {
  const navigate = useNavigate()
  const { loanRequests, loading } = useAppSelector((state) => state.loanRequests)  

  return (
    <DataTable 
      data={loanRequests} 
      columns={loanRequestColumns}
      actions={getLoanRequestActions(navigate)}
      itemsPerPage={10}
      defaultSortField="loanNumber"
      defaultSortOrder="desc"
      emptyMessage="No se encontraron solicitudes de crédito"
      emptyIcon="pi pi-file"
      loading={loading}
      onSelectionChange={() => {}}
      selectable={false}
    />
  )
}

