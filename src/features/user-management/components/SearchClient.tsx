import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useState } from "react"
import { SearchClientProps, SearchFilters } from "../models/SearchFiltersModel"
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown"
import Label from "../../../components/form/Label"


export default function SearchClient({ onFiltersChange }: SearchClientProps) {
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: null,
    role: null
  })

  const statusOptions: DropdownOption[] = [
    { label: 'Todos los estados', value: null },
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
    { label: 'Suspendido', value: 'suspended' }
  ]

  const roleOptions: DropdownOption[] = [
    { label: 'Todos los roles', value: null },
    { label: 'Administrador', value: 'admin' },
    { label: 'Asesor', value: 'advisor' }
  ]

  const handleStatusChange = (value: string | number | null) => {
    updateFilters({ status: value as string | null })
  }

  const handleRoleChange = (value: string | number | null) => {
    updateFilters({ role: value as string | null })
  }

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      status: null,
      role: null
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = filters.searchTerm || 
                          filters.status || 
                          filters.role

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Búsqueda</h3>
        </div>
              
      </div>

      <div className="mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>
            <i className="pi pi-circle mr-2"></i>
            Estado
          </Label>
          <Dropdown
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            placeholder="Todos los estados"
            showClear
            className="w-full"
          />
        </div>

        <div>
          <Label>
            <i className="pi pi-id-card mr-2"></i>
            Rol
          </Label>
          <Dropdown
            options={roleOptions}
            value={filters.role}
            onChange={handleRoleChange}
            placeholder="Todos los roles"
            showClear
            className="w-full"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
              
              {filters.searchTerm && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <i className="pi pi-search mr-1"></i>
                  "{filters.searchTerm}"
                </span>
              )}
              
              {filters.status && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <i className="pi pi-circle mr-1"></i>
                  {statusOptions.find(s => s.value === filters.status)?.label}
                </span>
              )}

              {filters.role && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <i className="pi pi-id-card mr-1"></i>
                  {roleOptions.find(s => s.value === filters.role)?.label}
                </span>
              )}
            </div>

            <Button 
              label="Limpiar Filtros"
              icon="pi pi-times"
              size="small"
              text
              className="text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg px-4 py-2" 
              onClick={clearFilters}
            />  
          </div>
        </div>
      )}
    </div>
  )
}
