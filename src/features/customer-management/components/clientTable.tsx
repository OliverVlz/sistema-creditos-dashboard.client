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
import { forgotPassword } from '../../auth/slices/operations/forgotPasswordOperations'

export default function ClientTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clients, loading } = useAppSelector((state) => state.clients)  
  const isAdmin = user?.role === 'ADMIN'
  const canManageClients = user?.role === 'ADMIN' || user?.role === 'ASESOR'
  
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

  const handleSendPasswordRecovery = async (targetClient: Client) => {
    if (!targetClient.email) {
      await Swal.fire({
        title: 'Cliente sin correo',
        text: 'El cliente no tiene un correo registrado para enviar recuperación.',
        icon: 'warning',
        confirmButtonColor: '#FF8546',
      })
      return
    }

    const result = await Swal.fire({
      title: '¿Enviar recuperación de contraseña?',
      text: `Se enviará un correo a ${targetClient.email}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await forgotPassword({ email: targetClient.email.trim().toLowerCase() })
      await Swal.fire({
        title: 'Correo enviado',
        text: 'Se envió el correo de recuperación de contraseña.',
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })
    } catch {
      await Swal.fire({
        title: 'No se pudo enviar',
        text: 'No fue posible enviar el correo de recuperación.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  return (
  <DataTable 
  data={clients} 
  columns={clientColumns}
  actions={getClientActions(
    navigate,
    handleToggleClientStatus,
    (row) => handleDeleteClient(String(row.id)),
    handleSendPasswordRecovery,
    canManageClients,
    isAdmin,
  )}
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
