// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { User } from '../models/usersTableConfig'
import { userColumns } from '../constants/usersTable'

export default function UserTable() {
  const mockUsers: User[] = [
        { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', role: 'admin', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
        { id: 2, firstName: 'María', lastName: 'González López', role: 'user', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', isActive: true, createdAt: '2024-02-20', updatedAt: '2024-02-20' },
        { id: 3, firstName: 'Paco', lastName: 'paco paco', role: 'user', documentType: 'CC', documentNumber: '100744906', email: 'paco.paco@armada.mil.co', phone: '3109876543', isActive: false, createdAt: '2024-02-20', updatedAt: '2024-02-20' },
    ]
  return <DataTable 
  data={mockUsers} 
  columns={userColumns} 
  itemsPerPage={10}
  defaultSortField="id"
  defaultSortOrder="asc"
  emptyMessage="No se encontraron usuarios"
  emptyIcon="pi pi-users"
  />
}