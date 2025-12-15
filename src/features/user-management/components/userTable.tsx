// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { userColumns, getUserActions } from '../constants/usersTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { fetchUsers } from '../slices/operations/fetchUsers.operation'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { users, loading } = useAppSelector((state) => state.users)  
  
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
  

  return (
    <div>
        <DataTable 
        data={users} 
        columns={userColumns}
        actions={getUserActions(navigate)}
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
