import { useMemo } from 'react';
import { useAppSelector } from '../../../store/index';
import { 
  ListIcon, 
  TimeIcon, 
  CheckCircleIcon,
  AlertIcon 
} from '../../../icons';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Componente de tarjetas de estadísticas para ADMIN y ASESOR
 * Muestra resumen de solicitudes: total, pendientes, aprobadas, en revisión
 */
export default function StatsCards() {
  const { loanRequests, pagination } = useAppSelector((state) => state.loanRequests);

  // Calcular estadísticas desde los datos cargados
  const stats = useMemo(() => {
    const total = pagination?.total || loanRequests.length;
    const pendientes = loanRequests.filter(r => r.status === 'pendiente').length;
    const enRevision = loanRequests.filter(r => r.status === 'en_revision').length;
    const aprobados = loanRequests.filter(r => r.status === 'aprobado').length;

    return { total, pendientes, enRevision, aprobados };
  }, [loanRequests, pagination]);

  const cards: StatCard[] = [
    {
      title: 'Total Solicitudes',
      value: stats.total,
      icon: <ListIcon className="w-7 h-7" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'Pendientes',
      value: stats.pendientes,
      icon: <TimeIcon className="w-7 h-7" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      title: 'En Revisión',
      value: stats.enRevision,
      icon: <AlertIcon className="w-7 h-7" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Aprobadas',
      value: stats.aprobados,
      icon: <CheckCircleIcon className="w-7 h-7" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`
            relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.bgColor}
            p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
            animate-fade-in
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Decoración de fondo */}
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 dark:bg-white/5"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <p className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.color} opacity-80`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
