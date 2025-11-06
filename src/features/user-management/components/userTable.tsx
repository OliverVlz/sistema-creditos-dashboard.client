// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { userColumns, userActions } from '../constants/usersTable'
import { useAppDispatch, useAppSelector } from '../../../store/index'
import { fetchUsers } from '../slices/operations/fetchUsers.operation'
import { useEffect } from 'react'

export default function UserTable() {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((state) => state.users)  
  
  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchUsers())
  }, [dispatch])
  

  return (
    <div>
        <DataTable 
        data={users} 
        columns={userColumns}
        actions={userActions}
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