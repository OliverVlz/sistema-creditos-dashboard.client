import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import type { LoanRequestTableItem } from '../../loan-requests/models/loanRequestsModel';

interface HomeRecentRequestsProps {
  isClient: boolean;
}

const statusColors: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  aprobado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rechazado: 'bg-rose-50 text-rose-700 border-rose-200',
  en_revision: 'bg-sky-50 text-sky-700 border-sky-200',
  desembolsado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));

export default function HomeRecentRequests({ isClient }: HomeRecentRequestsProps) {
  const { loanRequests } = useAppSelector((state) => state.loanRequests);

  if (!loanRequests || loanRequests.length === 0) {
    return null;
  }

  const items = (loanRequests as LoanRequestTableItem[]).slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {isClient ? 'Últimas solicitudes' : 'Solicitudes recientes'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isClient
              ? 'Un vistazo rápido al estado de tus créditos.'
              : 'Resumen de actividad reciente en el sistema.'}
          </p>
        </div>
        <Link
          to="/gestion-solicitudes"
          className="text-xs font-medium text-[#FF8546] hover:text-[#e86c30] transition-colors"
        >
          Ver todas
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const statusKey = (item.status || '').toLowerCase();
          const statusClass = statusColors[statusKey] ?? 'bg-gray-50 text-gray-700 border-gray-200';

          return (
            <Link
              key={item.id}
              to={`/gestion-solicitudes/detalle/${item.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-2.5 hover:border-[#FF8546]/60 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {item.loanNumber}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {isClient ? item.organizationName : item.clientName}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(item.createdAt)}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.amountRequested)}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium capitalize ${statusClass}`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


