// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { userColumns, getUserActions } from '../constants/usersTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { fetchUsers } from '../slices/operations/fetchUsers.operation'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { editUserById } from '../slices/operations/editUserById.operation'
import { updateUserStatusById } from '../slices/users.slices'
import { User } from '../models/usersTableConfig'
import { forgotPassword } from '../../auth/slices/operations/forgotPasswordOperations'

export default function UserTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { users, loading } = useAppSelector((state) => state.users)  
  const isAdmin = user?.role === 'ADMIN'
  const canManageUsers = user?.role === 'ADMIN' || user?.role === 'ASESOR'
  
  useEffect(() => {
    dispatch(fetchUsers({}))
  }, [dispatch])

  const handleToggleUserStatus = async (targetUser: User) => {
    const nextStatus = !targetUser.isActive
    const result = await Swal.fire({
      title: nextStatus ? '¿Activar usuario?' : '¿Desactivar usuario?',
      text: nextStatus
        ? 'El usuario volverá a tener acceso al sistema.'
        : 'El usuario quedará inhabilitado y no podrá ingresar.',
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
        editUserById({
          userId: String(targetUser.id),
          user: { isActive: nextStatus },
        }),
      ).unwrap()
      dispatch(updateUserStatusById({ userId: targetUser.id, isActive: nextStatus }))
      await Swal.fire({
        title: nextStatus ? 'Usuario activado' : 'Usuario desactivado',
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

  const handleSendPasswordRecovery = async (targetUser: User) => {
    if (!targetUser.email) {
      await Swal.fire({
        title: 'Usuario sin correo',
        text: 'El usuario no tiene un correo registrado para enviar recuperación.',
        icon: 'warning',
        confirmButtonColor: '#FF8546',
      })
      return
    }

    const result = await Swal.fire({
      title: '¿Enviar recuperación de contraseña?',
      text: `Se enviará un correo a ${targetUser.email}.`,
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
      await forgotPassword({ email: targetUser.email.trim().toLowerCase() })
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
    <div>
        <DataTable 
        data={users} 
        columns={userColumns}
        actions={getUserActions(
          navigate,
          handleToggleUserStatus,
          handleSendPasswordRecovery,
          canManageUsers,
          isAdmin,
        )}
        itemsPerPage={10}
        defaultSortField="id"
        defaultSortOrder="asc"
        emptyMessage="No se encontraron usuarios"
        emptyIcon="pi pi-users"
        loading={loading}
        onSelectionChange={() => {}}
        selectable={false}
        />
    </div>
)}
