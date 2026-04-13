// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { clientColumns, getClientActions } from '../constants/clientTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { useEffect } from 'react'
import { fetchClients } from '../slices/operations/fetchClients.operation'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { deleteClientById } from '../slices/operations/deleteClientById.operation'
import { removeClientById, updateClientStatusById } from '../slices/client.slices'
import { editClientById } from '../slices/operations/editClientById.operations'
import { Client } from '../models/clientsTableModel'

export default function ClientTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clients, loading } = useAppSelector((state) => state.clients)  
  const isAdmin = user?.role === 'ADMIN'
  
useEffect(() => {
    dispatch(fetchClients({}))
  }, [dispatch])

  const handleToggleClientStatus = async (targetClient: Client) => {
    const nextStatus = !targetClient.isActive
    const result = await Swal.fire({
      title: nextStatus ? '¿Activar cliente?' : '¿Desactivar cliente?',
      text: nextStatus
        ? 'El cliente volverá a estar habilitado en el sistema.'
        : 'El cliente quedará inhabilitado pero seguirá existiendo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: nextStatus ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await dispatch(
        editClientById({
          clientId: String(targetClient.id),
          client: { isActive: nextStatus },
        }),
      ).unwrap()
      dispatch(updateClientStatusById({ clientId: targetClient.id, isActive: nextStatus }))
      await Swal.fire({
        title: nextStatus ? 'Cliente activado' : 'Cliente desactivado',
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })
    } catch {
      await Swal.fire({
        title: 'No se pudo actualizar el estado',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  const handleDeleteClient = async (userId: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Se eliminará el cliente y todas sus solicitudes relacionadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await dispatch(deleteClientById(userId)).unwrap()
      dispatch(removeClientById(userId))
      await Swal.fire({
        title: 'Cliente eliminado',
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })
    } catch {
      await Swal.fire({
        title: 'No se pudo eliminar',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  return (
  <DataTable 
  data={clients} 
  columns={clientColumns}
  actions={getClientActions(navigate, handleToggleClientStatus, (row) => handleDeleteClient(String(row.id)), isAdmin)}
  itemsPerPage={10}
  defaultSortField="createdAt"
  defaultSortOrder="desc"
  emptyMessage="No se encontraron clientes"
  emptyIcon="pi pi-users"
  loading={loading}
  onSelectionChange={() => {}}
  selectable={false}
  />
)}
