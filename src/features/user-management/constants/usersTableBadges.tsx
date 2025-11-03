import { User } from '../models/usersTableConfig'

export const StatusBadge = ({ status }: { status: User['isActive'] }) => {
  const config = {
    true: { color: 'green', label: 'Activo' },
    false: { color: 'gray', label: 'Inactivo' },
  }

  const { color, label } = config[status ? 'true' : 'false'] as { color: string; label: string }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      <div className={`w-1.5 h-1.5 bg-${color}-400 rounded-full mr-1.5`}></div>
      {label}
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


