// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { clientColumns, getClientActions } from '../constants/clientTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { useEffect } from 'react'
import { fetchClients } from '../slices/operations/fetchClients.operation'
import { useNavigate } from 'react-router-dom'

export default function ClientTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { clients, loading } = useAppSelector((state) => state.clients)  
  
useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  return (
  <DataTable 
  data={clients} 
  columns={clientColumns}
  actions={getClientActions(navigate)}
  itemsPerPage={10}
  defaultSortField="id"
  defaultSortOrder="asc"
  emptyMessage="No se encontraron clientes"
  emptyIcon="pi pi-users"
  loading={loading}
  onSelectionChange={() => {}}
  selectable={false}
  />
)}
