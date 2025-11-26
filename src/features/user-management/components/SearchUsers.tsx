import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { SearchUsersProps, SearchFilters } from "../models/SearchFiltersModel"
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown"
import { useNavigate } from "react-router-dom"
import { fetchUsers } from "../slices/operations/fetchUsers.operation"
import { useAppDispatch } from "../../../store/index"

export default function SearchUsers({ onFiltersChange }: SearchUsersProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: undefined,
    role: undefined
  })

  const statusOptions: DropdownOption[] = [
    { label: 'Todos', value: null },
    { label: 'Activo', value: 'true' },
    { label: 'Inactivo', value: 'false' },
  ]

  const roleOptions: DropdownOption[] = [
    { label: 'Todos', value: null },
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Asesor', value: 'ASESOR' },
    { label: 'Cliente', value: 'CLIENTE' },
  ]

  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchUsers({ page: 1, limit: 100, searchTerm: filters.searchTerm, role: filters.role }))
  }, [filters.searchTerm, filters.role, dispatch])

  const handleStatusChange = (value: string | number | null | undefined) => {
    updateFilters({ status: value as string | null | undefined })
  }

  const handleRoleChange = (value: string | number | null | undefined) => {
    updateFilters({ role: value as string | null | undefined })
  }

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      status: undefined,
      role: undefined
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = filters.searchTerm || 
                          filters.status || 
                          filters.role

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
      {/* Línea principal con todos los filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[250px] relative">
          <InputText 
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            placeholder="Buscar por nombre, documento, correo..." 
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
        </div>

        {/* Estado */}
        <div className="w-[140px]">
          <Dropdown
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            placeholder="Estado"
            showClear
            className="w-full text-sm"
          />
        </div>

        {/* Rol */}
        <div className="w-[150px]">
          <Dropdown
            options={roleOptions}
            value={filters.role}
            onChange={handleRoleChange}
            placeholder="Rol"
            showClear
            className="w-full text-sm"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button 
              
              icon="pi pi-times"
              size="small"
              text
              tooltipOptions={{ position: 'bottom' }}
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 h-[38px] w-[38px]" 
              onClick={clearFilters}
            />
          )}
          
          <Button 
            label="Crear Usuario"
/*             icon="pi pi-plus"
 */            size="small"
            className="bg-orange-600 hover:bg-orange-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
            onClick={() => navigate('/dashboard/crear-usuario')}
          />
        </div>
      </div>

      {/* Indicador de filtros activos (opcional, compacto) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filtros:</span>
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              "{filters.searchTerm}"
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              {statusOptions.find(s => s.value === filters.status)?.label}
            </span>
          )}
          {filters.role && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
              {roleOptions.find(s => s.value === filters.role)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}