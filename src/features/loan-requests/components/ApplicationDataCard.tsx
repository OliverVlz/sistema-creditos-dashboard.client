import type { ReactNode } from 'react'
import { LoanRequestDetail } from '../models/loanRequestsModel'

interface ApplicationDataCardProps {
  loanRequest: LoanRequestDetail
}

// Helper para formatear dinero
const formatMoney = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)
}

// Helper para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Helper para obtener el color del estado
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'aprobado':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'rechazado':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'en_revision':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'pendiente':
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

// Helper para obtener el label del estado
const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'aprobado':
      return 'Aprobado'
    case 'rechazado':
      return 'Rechazado'
    case 'en_revision':
      return 'En Revisión'
    case 'pendiente':
    default:
      return 'Pendiente de Revisión'
  }
}

// Componente de campo de datos compacto
const DataField = ({ label, value, highlight = false, isStatus = false, statusClass = '' }: { 
  label: string
  value: string | ReactNode
  highlight?: boolean
  isStatus?: boolean
  statusClass?: string
}) => (
  <div className="min-w-0">
    <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </label>
    {isStatus ? (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {value}
      </span>
    ) : (
      <p className={`text-sm font-medium truncate ${highlight ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    )}
  </div>
)

export default function ApplicationDataCard({ loanRequest }: ApplicationDataCardProps) {
  const clientName = loanRequest.client?.user 
    ? `${loanRequest.client.user.firstName || ''} ${loanRequest.client.user.lastName || ''}`.trim() 
    : '---'
  
  const clientId = loanRequest.client?.user?.documentNumber || loanRequest.client?.user?.identification || '---'
  const clientPhone = loanRequest.client?.user?.phoneNumber || loanRequest.client?.user?.phone || '---'
  const clientEmail = loanRequest.client?.user?.email || '---'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        Datos de la Solicitud
      </h2>

      {/* Información Personal - Grid de 2 columnas */}
      <div className="mb-5">
        <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Información Personal
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <DataField label="Nombre" value={clientName} />
          <DataField label="Cédula/ID" value={clientId} />
          <DataField label="Teléfono" value={clientPhone} />
          <DataField label="Email" value={clientEmail} />
        </div>
      </div>

      {/* Detalles de la Solicitud - Grid de 2 columnas */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Detalles de la Solicitud
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <DataField label="ID Solicitud" value={loanRequest.loanNumber} highlight />
          <DataField 
            label="Estado" 
            value={getStatusLabel(loanRequest.status)} 
            isStatus 
            statusClass={getStatusColor(loanRequest.status)} 
          />
          <DataField label="Monto Solicitado" value={formatMoney(loanRequest.amountRequested)} />
          <DataField label="Plazo" value={`${loanRequest.termMonths} meses`} />
          <DataField 
            label="Tasa de Interés" 
            value={`${loanRequest.annualRate ?? loanRequest.appliedInterestRate ?? '---'}%`} 
          />
          <DataField label="Destino" value={loanRequest.loanType?.name || '---'} />
          <div className="col-span-2">
            <DataField label="Fecha de Solicitud" value={formatDate(loanRequest.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  )
}

