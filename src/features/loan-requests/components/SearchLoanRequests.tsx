import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown"
import { fetchLoanRequests } from "../slices/operations/fetchLoanRequests.operation"
import { useAppDispatch, useAppSelector } from "../../../store/index"
import { LoanRequestFilters } from "../models/loanRequestsModel"
import { useAuth } from "../../../hooks/useAuth"
import { fetchMyProfile } from "../../profile/slices/operations/fetchMyProfile.operation"

export default function SearchLoanRequests() {
  const dispatch = useAppDispatch()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useAppSelector((state) => state.profile)
  
  const [filters, setFilters] = useState<LoanRequestFilters>({
    loanNumber: '',
    status: undefined,
    page: 1,
    limit: 10
  })

  // Determinar si el usuario es cliente (solo cuando auth ya cargó)
  const isClient = !authLoading && user?.role === 'CLIENTE'
  
  // Verificar si el profile corresponde al usuario actual
  const isProfileValid = profile && user && profile.id === user.id
  
  // Obtener el clientId del perfil cuando es un cliente y el profile es válido
  // IMPORTANTE: Es clientInfo.id, NO el id del usuario
  const clientId = isClient && isProfileValid && profile?.clientInfo ? profile.clientInfo.id : undefined

  // Cargar el perfil si es cliente y no lo tenemos o si es de otro usuario
  useEffect(() => {
    if (isClient && user && !profileLoading) {
      // Cargar si no hay profile o si el profile es de otro usuario
      if (!profile || profile.id !== user.id) {
        console.log('Cargando perfil del cliente...')
        dispatch(fetchMyProfile())
      }
    }
  }, [isClient, user, profile, profileLoading, dispatch])

  // Hacer la petición de loans cuando tengamos todo listo
  useEffect(() => {
    // Esperar a que se cargue la información de autenticación
    if (authLoading) {
      console.log('Esperando autenticación...')
      return
    }

    // Si es cliente, esperar a tener el clientId válido
    if (isClient) {
      if (!clientId) {
        console.log('Esperando clientId válido... (clientInfo.id)')
        return
      }
      console.log('ClientId obtenido de clientInfo.id:', clientId)
    }

    console.log('Haciendo petición de loans con filtros:', {
      ...filters,
      clientId: clientId || '(sin filtro - ASESOR/ADMIN)'
    })

    dispatch(fetchLoanRequests({ 
      page: filters.page, 
      limit: filters.limit, 
      loanNumber: filters.loanNumber, 
      status: filters.status,
      clientId: clientId // Solo se envía si es CLIENTE y tenemos el id
    }))
  }, [filters.loanNumber, filters.status, filters.page, filters.limit, dispatch, clientId, isClient, authLoading])

  const statusOptions: DropdownOption[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'preaprobado', label: 'Preaprobado' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' }
  ];

  const handleStatusChange = (value: string | number | null | undefined) => {
    updateFilters({ status: value as string | undefined })
  }

  const updateFilters = (newFilters: Partial<LoanRequestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      loanNumber: '',
      status: undefined,
      page: 1,
      limit: 10
    })
  }

  const hasActiveFilters = filters.loanNumber || filters.status

  // Si es cliente y aún no tenemos el perfil válido, mostrar loading
  if (isClient && (!clientId || profileLoading)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <i className="pi pi-spin pi-spinner"></i>
          <span className="text-sm">Cargando información del cliente...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 mb-3 sm:mb-4">
      {/* Línea principal con todos los filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
        {/* Búsqueda por número de préstamo */}
        <div className="flex-1 min-w-[250px] relative">
          <InputText 
            value={filters.loanNumber || ''}
            onChange={(e) => updateFilters({ loanNumber: e.target.value })}
            placeholder="Buscar por número de préstamo, nombre completo o cédula..." 
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
        </div>

        {/* Estado */}
        <div className="w-full sm:w-[140px]">
          <Dropdown
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            placeholder="Estado"
            showClear
            className="w-full text-sm"
          />
        </div>

        {/* Botón de limpiar filtros */}
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
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filtros:</span>
          {filters.loanNumber && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              Nº: "{filters.loanNumber}"
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              {statusOptions.find(s => s.value === filters.status)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
