// components/shared/DataTable/DataTable.tsx

import { useState, useMemo } from 'react'
import { Button } from 'primereact/button'
import { DataTableProps, DataTableState } from './DataTable.types'
import Pagination from './Pagination'
import Dropdown, { DropdownOption } from '../../../components/ui/Dropdown'

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  actions = [],
  itemsPerPage = 10,
  showPagination = true,
  defaultSortField,
  defaultSortOrder = 'asc',
  className = '',
  emptyMessage = 'No hay datos disponibles',
  emptyIcon = 'pi pi-inbox',
  loading = false,
}: DataTableProps<T>) {

  // Estado de la tabla
  const [state, setState] = useState<DataTableState<T>>({
    currentPage: 1,
    sortField: defaultSortField || null,
    sortOrder: defaultSortOrder,
    itemsPerPage,
    selectedRows: []
  })

  const itemsPerPageOptions: DropdownOption[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ]

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!state.sortField) return data

    return [...data].sort((a, b) => {
      const aValue = a[state.sortField!]
      const bValue = b[state.sortField!]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return state.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return state.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [data, state.sortField, state.sortOrder])

  // Paginación
  const totalPages = Math.ceil(sortedData.length / state.itemsPerPage)
  const startIndex = (state.currentPage - 1) * state.itemsPerPage
  const endIndex = startIndex + state.itemsPerPage
  const currentData = sortedData.slice(startIndex, endIndex)

  // Manejar ordenamiento
  const handleSort = (field: keyof T) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      currentPage: 1
    }))
  }

  // Manejar cambio de items por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setState(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }))
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
  }

  // Componente de ícono de ordenamiento
  const SortIcon = ({ field }: { field: keyof T }) => {
    if (state.sortField !== field) {
      return <i className="pi pi-sort text-gray-400 dark:text-gray-500 ml-1 text-xs"></i>
    }
    return (
      <i className={`ml-1 text-xs ${
        state.sortOrder === 'asc'
          ? 'pi pi-sort-up text-blue-500 dark:text-blue-400'
          : 'pi pi-sort-down text-blue-500 dark:text-blue-400'
      }`}></i>
    )
  }

  // Colores para los botones de acción
  const getActionColorClasses = (color?: string) => {
    const colorMap = {
      blue: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20',
      green: 'text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20',
      red: 'text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20',
      purple: 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20',
      gray: 'text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12">
        <div className="flex flex-col items-center justify-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 dark:text-blue-400 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="overflow-x-auto rounded-t-2xl">
        <table className="w-full">
          {/* HEADER */}
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.field)}
                  className={`px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors' : ''
                  } text-${column.align || 'left'}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                >
                  <div className={`flex items-center ${
                    column.align === 'center' ? 'justify-center' : 
                    column.align === 'right' ? 'justify-end' : ''
                  }`}>
                    {column.headerIcon && <i className={`${column.headerIcon} mr-2`}></i>}
                    {column.header}
                    {column.sortable !== false && <SortIcon field={column.field} />}
                  </div>
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <i className={`${emptyIcon} text-gray-400 dark:text-gray-500 text-4xl mb-4`}></i>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {emptyMessage}
                    </h3>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr
                  key={`${String(row.id)}-${startIndex + index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-150 group"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.field)}
                      className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'} text-gray-700 dark:text-gray-200`}
                    >
                      {column.render ? column.render(row) : String(row[column.field] || '-')}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        {actions.map((action, actionIndex) => {
                          // Si hay condición para mostrar, evaluar
                          if (action.show && !action.show(row)) return null

                          return (
                            <Button
                              key={actionIndex}
                              icon={action.icon}
                              size="small"
                              text
                              className={`${getActionColorClasses(action.color)} w-8 h-8 rounded-lg`}
                              tooltip={action.label}
                              onClick={() => action.onClick(row)}
                            />
                          )
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER CON PAGINACIÓN */}
      {showPagination && sortedData.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl overflow-visible">
          <div className="flex items-center justify-between">
            {/* Items por página */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Mostrar:</span>
              <Dropdown
                value={state.itemsPerPage}
                options={itemsPerPageOptions}
                onChange={(value) => handleItemsPerPageChange(value as number)}
                className="w-20"
              />
            </div>

            {/* Información */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={state.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}