import { User } from '../models/usersTableConfig'

export const StatusBadge = ({ status }: { status: User['isActive'] }) => {
  if (status) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
        <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></div>
        Activo
      </span>
    )
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5"></div>
      Inactivo
    </span>
  )
}

/* export const LoansIndicator = ({ count }: { count: number }) => {
  let colorClass = 'text-gray-600 bg-gray-50'
  if (count > 0) colorClass = 'text-gray-500 bg-gray-50'    
  if (count > 2) colorClass = 'text-gray-500 bg-gray-50'

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${colorClass}`}>
      {count}
    </span>
  )
} */

/* export const getBranchLabel = (branch: User['branch']) => {
  const labels: Record<User['branch'], string> = {
    ejercito: 'Ejército Nacional',
    armada: 'Armada Nacional',
    fuerza_aerea: 'Fuerza Aérea',
    policia: 'Policía Nacional',
    pensionado: 'Pensionado',
    otro: 'Otro'
  }
  return labels[branch]
} */


