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

export default function UserTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { users, loading } = useAppSelector((state) => state.users)  
  const isAdmin = user?.role === 'ADMIN'
  
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
  

  return (
    <div>
        <DataTable 
        data={users} 
        columns={userColumns}
        actions={getUserActions(navigate, handleToggleUserStatus, isAdmin)}
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
