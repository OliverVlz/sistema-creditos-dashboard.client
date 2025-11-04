import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { SearchClientProps, SearchFilters } from "../models/SearchFiltersModel"
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown"
import Label from "../../../components/form/Label"
import { useNavigate } from "react-router-dom"
import { fetchUsers } from "../slices/operations/fetchUsers.operation"
import { useAppDispatch } from "../../../store/index"

export default function SearchClient({ onFiltersChange }: SearchClientProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
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
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Asesor', value: 'ADVISOR' },
    { label: 'Cliente', value: 'CLIENT' },
  ]

  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchUsers( { page: 1, limit: 100, searchTerm: filters.searchTerm, role: filters.role }))
  }, [filters.searchTerm, filters.role])

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Búsqueda</h3>
        </div>
        <Button 
          label="Crear Usuario"
          size="small"
          text
          className="bg-white dark:bg-gray-900 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-500 dark:border-orange-600 rounded-lg px-4 py-2 transition-colors"
          onClick={() => {
            navigate('/dashboard/crear-usuario')
          }}
        />
      </div>

      <div className="mb-6">
        <div className="relative">
          <InputText 
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            placeholder="Buscar por nombre, documento, correo..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
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
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtros activos:</span>
              
              {filters.searchTerm && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  <i className="pi pi-search mr-1"></i>
                  "{filters.searchTerm}"
                </span>
              )}
              
              {filters.status && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  <i className="pi pi-circle mr-1"></i>
                  {statusOptions.find(s => s.value === filters.status)?.label}
                </span>
              )}

              {filters.role && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
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
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-600 rounded-lg px-4 py-2" 
              onClick={clearFilters}
            />  
          </div>
        </div>
      )}
    </div>
  )
}
