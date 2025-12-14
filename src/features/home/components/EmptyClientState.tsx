import { Link } from 'react-router-dom';
import { 
  ShootingStarIcon, 
  PlusIcon,
  DollarLineIcon,
  LockIcon,
  TimeIcon
} from '../../../icons';

/**
 * Componente de estado vacío para CLIENTES sin solicitudes
 * Mensaje llamativo y formal para incentivar la primera solicitud de crédito
 */
export default function EmptyClientState() {
  const benefits = [
    {
      icon: <DollarLineIcon className="w-5 h-5" />,
      title: 'Tasas Competitivas',
      description: 'Las mejores tasas del mercado para tu crédito'
    },
    {
      icon: <TimeIcon className="w-5 h-5" />,
      title: 'Aprobación Rápida',
      description: 'Respuesta en menos de 24 horas hábiles'
    },
    {
      icon: <LockIcon className="w-5 h-5" />,
      title: 'Proceso Seguro',
      description: 'Tu información está protegida en todo momento'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 border border-gray-100 dark:border-gray-700">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 dark:from-orange-900/20 dark:to-amber-900/10 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-100/40 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 blur-2xl"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8 text-center">
        {/* Ícono principal animado */}
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FF8546] to-[#ff6b2b] shadow-lg shadow-orange-500/25 mb-3 sm:mb-4 md:mb-6 animate-bounce-slow">
          <PlusIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
        </div>

        {/* Título principal */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <ShootingStarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8546]" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido a Presta Ya!
          </h3>
          <ShootingStarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8546]" />
        </div>

        {/* Subtítulo */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto leading-relaxed px-2">
          Aún no tienes solicitudes de crédito. Comienza tu camino hacia tus metas financieras 
          con nosotros. El proceso es rápido, seguro y transparente.
        </p>

        {/* Beneficios */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="flex flex-col items-center p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#FF8546]/10 text-[#FF8546] mb-1.5 sm:mb-2">
                {benefit.icon}
              </div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                {benefit.title}
              </h4>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Botón CTA */}
        <Link
          to="/dashboard/gestion-de-creditos"
          className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#FF8546] to-[#ff6b2b] hover:from-[#ff6b2b] hover:to-[#FF8546] text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-100 group text-xs sm:text-sm md:text-base"
        >
          <span>Solicitar mi Primer Crédito</span>
        </Link>

        {/* Nota adicional */}
       {/*  <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Sin compromisos • Sin costos ocultos • 100% en línea
        </p> */}
      </div>
    </div>
  );
}
