import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'
import SearchClient from '../search-clients/search-client'

interface SearchFilters {
  searchTerm: string
  status: string | null
  documentType: string | null
  branch: string | null
}

export default function ClientTable() {

    interface Client {
        id: number
        firstName: string
        lastName: string
        documentType: 'CC' | 'CE' | 'PA'
        documentNumber: string
        email: string
        phone: string
        branch: 'ejercito' | 'armada' | 'fuerza_aerea' | 'policia' | 'pensionado'
        rank: string
        status: 'active' | 'inactive' | 'suspended'
        registrationDate: string
        loansCount: number
    }

    const mockClients: Client[] = [
        { id: 1, firstName: 'Carlos', lastName: 'Rodríguez Martínez', documentType: 'CC', documentNumber: '1234567890', email: 'carlos.rodriguez@ejercito.mil.co', phone: '3001234567', branch: 'ejercito', rank: 'Capitán', status: 'active', registrationDate: '2024-01-15', loansCount: 2 },
        { id: 2, firstName: 'María', lastName: 'González López', documentType: 'CC', documentNumber: '0987654321', email: 'maria.gonzalez@armada.mil.co', phone: '3109876543', branch: 'armada', rank: 'Teniente', status: 'active', registrationDate: '2024-02-20', loansCount: 1 },
        { id: 3, firstName: 'José', lastName: 'Pérez Sánchez', documentType: 'CC', documentNumber: '1122334455', email: 'jose.perez@fac.mil.co', phone: '3201122334', branch: 'fuerza_aerea', rank: 'Sargento', status: 'inactive', registrationDate: '2023-11-10', loansCount: 0 },
        { id: 4, firstName: 'Ana', lastName: 'Jiménez Torres', documentType: 'CC', documentNumber: '5566778899', email: 'ana.jimenez@policia.gov.co', phone: '3005566778', branch: 'policia', rank: 'Patrullero', status: 'active', registrationDate: '2024-03-05', loansCount: 3 },
        { id: 5, firstName: 'Roberto', lastName: 'Vargas Ruiz', documentType: 'CC', documentNumber: '9988776655', email: 'roberto.vargas@pensionado.gov.co', phone: '3149988776', branch: 'pensionado', rank: 'Mayor (R)', status: 'suspended', registrationDate: '2023-08-22', loansCount: 1 },
        { id: 6, firstName: 'Carmen', lastName: 'Morales Díaz', documentType: 'CC', documentNumber: '4433221100', email: 'carmen.morales@ejercito.mil.co', phone: '3184433221', branch: 'ejercito', rank: 'Subteniente', status: 'active', registrationDate: '2024-01-30', loansCount: 0 },
        { id: 7, firstName: 'Luis', lastName: 'Herrera Castro', documentType: 'CE', documentNumber: '1357924680', email: 'luis.herrera@armada.mil.co', phone: '3021357924', branch: 'armada', rank: 'Cabo', status: 'active', registrationDate: '2024-02-14', loansCount: 2 },
        { id: 8, firstName: 'Patricia', lastName: 'Silva Mendoza', documentType: 'CC', documentNumber: '2468135790', email: 'patricia.silva@fac.mil.co', phone: '3112468135', branch: 'fuerza_aerea', rank: 'Técnico', status: 'active', registrationDate: '2023-12-18', loansCount: 1 },
        { id: 9, firstName: 'Fernando', lastName: 'Ramírez Ortega', documentType: 'CC', documentNumber: '1111222233', email: 'fernando.ramirez@policia.gov.co', phone: '3251111222', branch: 'policia', rank: 'Intendente', status: 'active', registrationDate: '2024-04-02', loansCount: 0 },
        { id: 10, firstName: 'Gloria', lastName: 'Ávila Núñez', documentType: 'CC', documentNumber: '3333444455', email: 'gloria.avila@pensionado.gov.co', phone: '3063333444', branch: 'pensionado', rank: 'Coronel (R)', status: 'inactive', registrationDate: '2023-09-15', loansCount: 4 },
    ]

    const [clients] = useState<Client[]>(mockClients)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<keyof Client>('id')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [itemsPerPage, setItemsPerPage] = useState(8)
    
    const [filters, setFilters] = useState<SearchFilters>({
        searchTerm: '',
        status: null,
        documentType: null,
        branch: null
    })

    const itemsPerPageOptions = [
        { label: '5', value: 5 },
        { label: '8', value: 8 },
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
    ]

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const filterClients = (clients: Client[], filters: SearchFilters): Client[] => {
        return clients.filter(client => {
            if (filters.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase()
                const matchesSearch = (
                    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm) ||
                    client.email.toLowerCase().includes(searchTerm) ||
                    client.documentNumber.includes(searchTerm) ||
                    client.phone.includes(searchTerm) ||
                    client.rank.toLowerCase().includes(searchTerm)
                )
                if (!matchesSearch) return false
            }

            if (filters.status && client.status !== filters.status) return false
            if (filters.documentType && client.documentType !== filters.documentType) return false
            if (filters.branch && client.branch !== filters.branch) return false

            return true
        })
    }

    const filteredClients = filterClients(clients, filters)

    const sortedClients = [...filteredClients].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  
    const totalPages = Math.ceil(sortedClients.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentClients = sortedClients.slice(startIndex, endIndex)
  
    const handleSort = (field: keyof Client) => {
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortOrder('asc')
      }
      setCurrentPage(1)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage)
      setCurrentPage(1)
    }

    const getBranchLabel = (branch: string) => {
      const branchLabels: Record<string, string> = {
        ejercito: 'Ejército Nacional',
        armada: 'Armada Nacional', 
        fuerza_aerea: 'Fuerza Aérea',
        policia: 'Policía Nacional',
        pensionado: 'Pensionado'
      }
      return branchLabels[branch] || branch
    }


  
    const StatusBadge = ({ status }: { status: 'active' | 'inactive' | 'suspended' }) => {
      if (status === 'active') {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
            Activo
          </span>
        )
      }
      
      if (status === 'suspended') {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
            Suspendido
          </span>
        )
      }
      
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
          Inactivo
        </span>
      )
    }

    const LoansIndicator = ({ count }: { count: number }) => {
      let colorClass = 'text-gray-600 bg-gray-50'
      
      if (count > 0) {
        colorClass = 'text-blue-600 bg-blue-50'
      }
      if (count > 2) {
        colorClass = 'text-purple-600 bg-purple-50'
      }

      return (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${colorClass}`}>
          {count}
        </span>
      )
    }
  
    const SortIcon = ({ field }: { field: keyof Client }) => {
      if (sortField !== field) {
        return <i className="pi pi-sort text-gray-400 ml-1"></i>
      }
      
      return (
        <i className={`ml-1 ${
          sortOrder === 'asc' 
            ? 'pi pi-sort-up text-blue-500' 
            : 'pi pi-sort-down text-blue-500'
        }`}></i>
      )
    }

    const getPageNumbers = () => {
      const delta = 2
      const range: number[] = []
      const rangeWithDots: (number | string)[] = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages)
      } else {
        rangeWithDots.push(totalPages)
      }

      return rangeWithDots
    }

    const hasActiveFilters = filters.searchTerm || 
                            filters.status || 
                            filters.documentType || 
                            filters.branch
  
    return (
      <div className="space-y-6">
        <SearchClient onFiltersChange={handleFiltersChange} />

        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="pi pi-search text-blue-600 mr-2"></i>
                <span className="text-blue-800 font-medium">
                  {filteredClients.length === 0 
                    ? 'No se encontraron clientes' 
                    : `${filteredClients.length} cliente${filteredClients.length !== 1 ? 's' : ''} encontrado${filteredClients.length !== 1 ? 's' : ''}`
                  }
                </span>
              </div>
              {filteredClients.length === 0 && (
                <span className="text-blue-600 text-sm">
                  Intenta ajustar los filtros de búsqueda
                </span>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      <SortIcon field="id" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('firstName')}
                  >
                    <div className="flex items-center">
                      Cliente
                      <SortIcon field="firstName" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('documentType')}
                  >
                    <div className="flex items-center">
                      Documento
                      <SortIcon field="documentType" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('branch')}
                  >
                    <div className="flex items-center">
                      Fuerza/Entidad
                      <SortIcon field="branch" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center">
                      Rango
                      <SortIcon field="rank" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('loansCount')}
                  >
                    <div className="flex items-center justify-center">
                      Préstamos
                      <SortIcon field="loansCount" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
    
              <tbody className="bg-white divide-y divide-gray-100">
                {currentClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <i className="pi pi-users text-gray-400 text-4xl mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No se encontraron clientes
                        </h3>
                        <p className="text-gray-500">
                          {hasActiveFilters 
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'No hay clientes registrados'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentClients.map((client) => (
                    <tr 
                      key={client.id} 
                      className="hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-sm font-medium">
                            {client.id}
                          </div>
                        </div>
                      </td>
        
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{client.email}</div>
                          </div>
                        </div>
                      </td>
        
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {client.documentType}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{client.documentNumber}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          {getBranchLabel(client.branch)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.rank}</div>
                      </td>
        
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <LoansIndicator count={client.loansCount} />
                      </td>
        
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={client.status} />
                      </td>
        
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            icon="pi pi-eye" 
                            size="small" 
                            text
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-8 h-8 rounded-lg"
                            tooltip="Ver Detalles"
                            onClick={() => console.log('Ver cliente:', client.id)}
                          />
                          <Button 
                            icon="pi pi-pencil" 
                            size="small" 
                            text
                            className="text-gray-600 hover:text-green-600 hover:bg-green-50 w-8 h-8 rounded-lg"
                            tooltip="Editar"
                            onClick={() => console.log('Editar cliente:', client.id)}
                          />
                          <Button 
                            icon="pi pi-file-text" 
                            size="small" 
                            text
                            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 w-8 h-8 rounded-lg"
                            tooltip="Ver Solicitudes"
                            onClick={() => console.log('Ver solicitudes:', client.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
    
          {filteredClients.length > 0 && (
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Mostrar:</span>
                    <Dropdown
                        value={itemsPerPage}
                        options={itemsPerPageOptions}
                        onChange={(e) => handleItemsPerPageChange(e.value)}
                        className="w-40 text-sm"
                        panelClassName="text-sm"
                    />
                </div>
                
                <div className="text-sm text-gray-700">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClients.length)} de {filteredClients.length} clientes
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    icon="pi pi-chevron-left"
                    size="small"
                    text
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="w-8 h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                  />
                  
                  {totalPages <= 7 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        label={page.toString()}
                        size="small"
                        text={currentPage !== page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg ${
                          currentPage === page 
                            ? 'bg-blue-500 text-white' 
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      />
                    ))
                  ) : (
                    getPageNumbers().map((page, index) => (
                      <span key={index}>
                        {page === '...' ? (
                          <span className="px-2 text-gray-500">...</span>
                        ) : (
                          <Button
                            label={page.toString()}
                            size="small"
                            text={currentPage !== page}
                            onClick={() => setCurrentPage(Number(page))}
                            className={`w-8 h-8 rounded-lg ${
                              currentPage === page 
                                ? 'bg-blue-500 text-white' 
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                          />
                        )}
                      </span>
                    ))
                  )}
                  
                  <Button
                    icon="pi pi-chevron-right"
                    size="small"
                    text
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-8 h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
}
