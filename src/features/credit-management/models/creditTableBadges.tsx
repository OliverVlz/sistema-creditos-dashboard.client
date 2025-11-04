import { Credit } from './creditTableConfig'

export const StatusBadge = ({ status }: { status: Credit['status'] }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
        <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></div>
        Aprobado
      </span>
    )
  }

  if (status === 'suspended') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700">
        <div className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full mr-1.5"></div>
        Rechazado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5"></div>
      Pendiente
    </span>
  )
}

export const LoansIndicator = ({ count }: { count: number }) => {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
      {count}
    </span>
  )
}

/* export const getBranchLabel = (branch: Credit['branch']) => {
  const labels: Record<Credit['branch'], string> = {
    ejercito: 'Ejército Nacional',
    armada: 'Armada Nacional',
    fuerza_aerea: 'Fuerza Aérea',
    policia: 'Policía Nacional',
    pensionado: 'Pensionado',
    otro: 'Otro'
  }
  return labels[branch]
} */


