import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
/* import { useEffect, useState } from "react"
 */
import { useState } from "react"
import { SearchFilters, SearchClientProps } from "../models/SearchFiltersClientModel"
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown"
import { useNavigate } from "react-router-dom"
/* import { fetchUsers } from "../slices/operations/fetchUsers.operation"
 *//* import { useAppDispatch } from "../../../store/index" */

export default function SearchClient({ onFiltersChange }: SearchClientProps) {
  const navigate = useNavigate()
/*   const dispatch = useAppDispatch()
 */  
    const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    employmentStatus: undefined
  })

  const employmentStatusOptions: DropdownOption[] = [
    { label: 'Todos', value: null },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Jubilado', value: 'JUBILADO' }, 
  ]

/*   useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchUsers({ page: 1, limit: 100, searchTerm: filters.searchTerm, role: filters.role }))
  }, [filters.searchTerm, filters.role, dispatch]) */

  const handleStatusChange = (value: string | number | null | undefined) => {
    updateFilters({ employmentStatus: value as string | null | undefined })
  }


  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      employmentStatus: undefined,
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = filters.searchTerm || 
                          filters.employmentStatus

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
        <div className="w-[200px]">
          <Dropdown
            options={employmentStatusOptions}
            value={filters.employmentStatus}
            onChange={handleStatusChange}
            placeholder="Estado Laboral"
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
            label="Crear Cliente"
/*             icon="pi pi-plus"
 */            size="small"
            className="bg-orange-600 hover:bg-orange-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
            onClick={() => navigate('/gestion-de-clientes/crear-cliente')}
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
          {filters.employmentStatus && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              {employmentStatusOptions.find(s => s.value === filters.employmentStatus)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}