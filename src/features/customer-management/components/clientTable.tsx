// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { clientColumns, clientActions } from '../constants/clientTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { useEffect } from 'react'
import { fetchClients } from '../slices/operations/fetchClients.operation'

export default function ClientTable() {
  const dispatch = useAppDispatch()
  const { clients, loading } = useAppSelector((state) => state.clients)  
  
useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchClients())
  }, [dispatch])

  return (
  <DataTable 
  data={clients} 
  columns={clientColumns}
  actions={clientActions}
  itemsPerPage={10}
  defaultSortField="documentNumber"
  defaultSortOrder="asc"
  emptyMessage="No se encontraron clientes"
  emptyIcon="pi pi-users"
  loading={loading}
  onSelectionChange={() => {}}
  selectable={false}
  />
)}