import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import { useState } from "react"

interface SearchFilters {
  searchTerm: string
  status: string | null
  documentType: string | null
  branch: string | null
}

interface SearchClientProps {
  onFiltersChange?: (filters: SearchFilters) => void
}

export default function SearchClient({ onFiltersChange }: SearchClientProps) {
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: null,
    documentType: null,
    branch: null
  })

  const statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
    { label: 'Suspendido', value: 'suspended' }
  ]

  const documentTypeOptions = [
    { label: 'Cédula de Ciudadanía', value: 'CC' },
    { label: 'Cédula de Extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PA' }
  ]

  const branchOptions = [
    { label: 'Ejército Nacional', value: 'ejercito' },
    { label: 'Armada Nacional', value: 'armada' },
    { label: 'Fuerza Aérea', value: 'fuerza_aerea' },
    { label: 'Policía Nacional', value: 'policia' },
    { label: 'Pensionado', value: 'pensionado' }
  ]

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      status: null,
      documentType: null,
      branch: null
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = filters.searchTerm || 
                          filters.status || 
                          filters.documentType || 
                          filters.branch

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Búsqueda y Filtros</h3>
          <p className="text-sm text-gray-600 mt-1">
            Encuentra clientes por nombre, documento o correo electrónico
          </p>
        </div>
        
        {hasActiveFilters && (
          <Button 
            label="Limpiar Filtros"
            icon="pi pi-times"
            size="small"
            text
            className="text-gray-600 hover:text-red-600"
            onClick={clearFilters}
          />
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="pi pi-search mr-2"></i>
          Búsqueda General
        </label>
        <div className="relative">
          <InputText 
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            placeholder="Buscar por nombre, documento, correo..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="pi pi-circle mr-2"></i>
            Estado
          </label>
          <Dropdown
            value={filters.status}
            options={statusOptions}
            onChange={(e) => updateFilters({ status: e.value })}
            placeholder="Todos los estados"
            className="w-full"
            showClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="pi pi-id-card mr-2"></i>
            Tipo de Documento
          </label>
          <Dropdown
            value={filters.documentType}
            options={documentTypeOptions}
            onChange={(e) => updateFilters({ documentType: e.value })}
            placeholder="Todos los tipos"
            className="w-full"
            showClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="pi pi-shield mr-2"></i>
            Fuerza/Entidad
          </label>
          <Dropdown
            value={filters.branch}
            options={branchOptions}
            onChange={(e) => updateFilters({ branch: e.value })}
            placeholder="Todas las fuerzas"
            className="w-full"
            showClear
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
            
            {filters.searchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <i className="pi pi-search mr-1"></i>
                "{filters.searchTerm}"
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <i className="pi pi-circle mr-1"></i>
                {statusOptions.find(s => s.value === filters.status)?.label}
              </span>
            )}

            {filters.documentType && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="pi pi-id-card mr-1"></i>
                {documentTypeOptions.find(s => s.value === filters.documentType)?.label}
              </span>
            )}
            
            {filters.branch && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <i className="pi pi-shield mr-1"></i>
                {branchOptions.find(s => s.value === filters.branch)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
