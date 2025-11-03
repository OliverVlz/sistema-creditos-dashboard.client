// pages/Clients/ClientsPage.tsx

import DataTable from '@share/components/table/DataTable'   
import { clientColumns, clientActions, Client } from '../models/clientTableConfig'

export default function ClientsPage() {
  const mockClients: Client[] = [
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
    { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
    { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
  ]



  return (
    <div className="space-y-6">
      <DataTable
        data={mockClients}
        columns={clientColumns}
        actions={clientActions}
        itemsPerPage={10}
        defaultSortField="id"
        defaultSortOrder="asc"
        emptyMessage="No se encontraron clientes"
        emptyIcon="pi pi-users"
      />
    </div>
  )
}