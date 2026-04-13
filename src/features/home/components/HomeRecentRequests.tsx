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

  const items = (loanRequests as LoanRequestTableItem[]).slice(0, 10);

  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-xl lg:rounded-2xl">
      <div className="flex shrink-0 flex-row items-start justify-between gap-2 border-b border-gray-100 p-3 dark:border-gray-700 sm:items-center sm:p-4 md:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm md:text-base">
            {isClient ? 'Últimas solicitudes' : 'Solicitudes recientes'}
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
            {isClient
              ? 'Un vistazo rápido al estado de tus créditos.'
              : 'Resumen de actividad reciente en el sistema.'}
          </p>
        </div>
        <Link
          to="/gestion-solicitudes"
          className="shrink-0 text-[10px] font-medium text-[#FF8546] hover:text-[#e86c30] sm:text-xs"
        >
          Ver todas
        </Link>
      </div>

      <div className="max-h-56 overflow-y-auto overscroll-contain px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4">
        <div className="space-y-2">
          {items.map((item) => {
            const statusKey = (item.status || '').toLowerCase();
            const statusClass = statusColors[statusKey] ?? 'bg-gray-50 text-gray-700 border-gray-200';

            return (
              <Link
                key={item.id}
                to={`/gestion-solicitudes/detalle/${item.id}`}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 transition hover:border-[#FF8546]/60 hover:bg-white active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800 xs:flex-row xs:items-center xs:justify-between sm:rounded-xl sm:p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-gray-900 dark:text-white sm:text-xs md:text-sm">
                    {item.loanNumber}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
                    {isClient ? item.organizationName : item.clientName}
                  </p>
                  <p className="mt-0.5 text-[9px] text-gray-400 sm:mt-1 sm:text-[10px]">{formatDate(item.createdAt)}</p>
                </div>

                <div className="flex flex-row items-center justify-between gap-2 xs:flex-col xs:items-end xs:justify-start xs:gap-1">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                    {formatCurrency(item.amountRequested)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-medium capitalize sm:text-[10px] ${statusClass} whitespace-nowrap`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
