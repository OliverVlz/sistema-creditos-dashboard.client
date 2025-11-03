// components/shared/DataTable/DataTable.types.ts

import { ReactNode } from 'react'

// Configuración de una columna
export interface Column<T> {
  field: keyof T                          // Campo del objeto (ej: 'firstName')
  header: string                          // Título de la columna (ej: 'Cliente')
  sortable?: boolean                      // ¿Se puede ordenar?
  width?: string                          // Ancho (ej: '200px', '20%')
  align?: 'left' | 'center' | 'right'    // Alineación
  render?: (row: T) => ReactNode         // Función custom para renderizar
  headerIcon?: string                     // Ícono en el header (ej: 'pi pi-user')
}

// Configuración de acciones
export interface Action<T> {
  icon: string                            // Ícono (ej: 'pi pi-eye')
  label: string                           // Tooltip
  onClick: (row: T) => void              // Función al hacer clic
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray'
  show?: (row: T) => boolean             // Mostrar condicionalmente
}

// Props del componente DataTable
export interface DataTableProps<T> {
  data: T[]                               // Los datos a mostrar
  columns: Column<T>[]                    // Configuración de columnas
  actions?: Action<T>[]                   // Acciones por fila
  
  // Paginación
  itemsPerPage?: number
  showPagination?: boolean
  
  // Ordenamiento
  defaultSortField?: keyof T
  defaultSortOrder?: 'asc' | 'desc'
  
  // Estilos
  className?: string
  emptyMessage?: string
  emptyIcon?: string
  
  // Loading
  loading?: boolean
  
  // Selección
  selectable?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
}

// Estado interno de la tabla
export interface DataTableState<T> {
  currentPage: number
  sortField: keyof T | null
  sortOrder: 'asc' | 'desc'
  itemsPerPage: number
  selectedRows: T[]
}