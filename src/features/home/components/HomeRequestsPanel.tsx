import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/index';
import { useRoleAccess } from '../../../hooks/useRoleAccess';
import { useAuth } from '../../../hooks/useAuth';
import { fetchLoanRequests } from '../../loan-requests/slices/operations/fetchLoanRequests.operation';
import { fetchMyProfile } from '../../profile/slices/operations/fetchMyProfile.operation';
import StatsCards from './StatsCards';
import EmptyClientState from './EmptyClientState';
import HomeRecentRequests from './HomeRecentRequests';

export default function HomeRequestsPanel() {
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAuth();
  const { isCliente, isAdmin, isAsesor } = useRoleAccess();

  const { loanRequests, loading } = useAppSelector((state) => state.loanRequests);
  const { profile, loading: profileLoading } = useAppSelector((state) => state.profile);

  const isProfileValid = profile && user && profile.id === user.id;

  const clientId =
    !authLoading && isCliente && isProfileValid && profile?.clientInfo ? profile.clientInfo.id : undefined;

  useEffect(() => {
    if (!authLoading && isCliente && user && !profileLoading) {
      if (!profile || profile.id !== user.id) {
        dispatch(fetchMyProfile());
      }
    }
  }, [authLoading, isCliente, user, profile, profileLoading, dispatch]);

  useEffect(() => {
    if (authLoading) return;
    if (isCliente && !clientId) return;

    dispatch(
      fetchLoanRequests({
        page: 1,
        limit: 10,
        clientId: clientId,
      }),
    );
  }, [dispatch, clientId, isCliente, authLoading]);

  if (loading || (isCliente && !clientId) || (isCliente && profileLoading)) {
    return (
      <div className="flex h-full min-h-[220px] flex-1 flex-col items-center justify-center lg:min-h-[min(560px,calc(100vh-200px))]">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-[#FF8546] sm:h-8 sm:w-8 md:h-10 md:w-10" />
          <p className="text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs md:text-sm">
            Cargando solicitudes...
          </p>
        </div>
      </div>
    );
  }

  if (isCliente && loanRequests.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <EmptyClientState />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex shrink-0 flex-col gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg md:text-xl lg:text-2xl">
            {isCliente ? 'Mis solicitudes' : 'Gestión de solicitudes'}
          </h2>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 sm:mt-1 sm:text-xs md:text-sm">
            {isCliente ? 'Revisa el estado de tus créditos' : 'Resumen de solicitudes del sistema'}
          </p>
        </div>

        <div className="flex flex-col gap-2 xs:flex-row xs:items-center">
          {isCliente && (
            <Link
              to="/dashboard/gestion-de-creditos"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#FF8546] to-[#ff6b2b] px-3 py-2 text-xs font-medium text-white shadow-md transition hover:from-[#ff6b2b] hover:to-[#FF8546] hover:shadow-lg sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
            >
              Nueva solicitud
            </Link>
          )}

          <Link
            to="/gestion-solicitudes"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
          >
            Ver todo
          </Link>
        </div>
      </div>

      {(isAdmin || isAsesor) && <StatsCards />}

      <div className="shrink-0">
        <HomeRecentRequests isClient={isCliente} />
      </div>
    </div>
  );
}
