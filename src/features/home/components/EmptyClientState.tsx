import { Link } from 'react-router-dom';

export default function EmptyClientState() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center rounded-2xl border border-gray-200 bg-white px-5 py-8 dark:border-gray-700 dark:bg-gray-800 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-md text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bienvenido a</p>
        <h3 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          Inversiones Murillo Martínez
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Aún no tienes solicitudes de crédito. Puedes iniciar una cuando lo necesites; el trámite es claro y
          estamos para acompañarte.
        </p>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Tasas competitivas · Respuesta en menos de 24 horas hábiles · Información protegida
        </p>
        <Link
          to="/dashboard/gestion-de-creditos"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#FF8546] to-[#ff6b2b] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-[#ff6b2b] hover:to-[#FF8546] hover:shadow-orange-500/35"
        >
          Solicitar mi primer crédito
        </Link>
      </div>
    </div>
  );
}
