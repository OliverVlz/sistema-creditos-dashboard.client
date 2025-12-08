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

/**
 * Panel de solicitudes para el Home
 * - ADMIN/ASESOR: Muestra tarjetas de estadísticas + tabla
 * - CLIENTE: Muestra su tabla o mensaje para crear solicitud
 */
export default function HomeRequestsPanel() {
  const dispatch = useAppDispatch();
  const { loading: authLoading } = useAuth();
  const { isCliente, isAdmin, isAsesor } = useRoleAccess();
  
  const { loanRequests, loading } = useAppSelector((state) => state.loanRequests);
  const { profile, loading: profileLoading } = useAppSelector((state) => state.profile);
  
  // Obtener clientId del perfil cuando es cliente (solo después de que auth cargó)
  const clientId = !authLoading && isCliente && profile?.clientInfo ? profile.clientInfo.id : undefined;

  // Cargar perfil si es cliente
  useEffect(() => {
    if (!authLoading && isCliente && !profile && !profileLoading) {
      // @ts-expect-error - Redux Toolkit types issue with React 19
      dispatch(fetchMyProfile());
    }
  }, [authLoading, isCliente, profile, profileLoading, dispatch]);

  // Cargar solicitudes
  useEffect(() => {
    // Esperar a que cargue la autenticación
    if (authLoading) return;
    
    // Si es cliente, esperar el clientId
    if (isCliente && !clientId) return;

    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchLoanRequests({ 
      page: 1, 
      limit: 10,
      clientId: clientId 
    }));
  }, [dispatch, clientId, isCliente, authLoading]);

  // Loading state
  if (loading || (isCliente && !clientId)) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#FF8546]"></div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  // Para CLIENTE: Si no tiene solicitudes, mostrar estado vacío
  if (isCliente && loanRequests.length === 0) {
    return <EmptyClientState />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header del panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {isCliente ? 'Mis Solicitudes' : 'Gestión de Solicitudes'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isCliente 
              ? 'Revisa el estado de tus créditos' 
              : 'Resumen de solicitudes del sistema'}
          </p>
        </div>

        {/* Botones de acción según rol */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {isCliente && (
            <Link
              to="/dashboard/gestion-de-creditos"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#FF8546] to-[#ff6b2b] hover:from-[#ff6b2b] hover:to-[#FF8546] text-white text-sm sm:text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>Nueva Solicitud</span>
            </Link>
          )}
          
          <Link
            to="/gestion-solicitudes"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <span>Ver Todo</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de estadísticas (solo para ADMIN y ASESOR) */}
      {(isAdmin || isAsesor) && <StatsCards />}

      {/* Lista compacta de solicitudes recientes en lugar de tabla completa */}
      <HomeRecentRequests isClient={isCliente} />
    </div>
  );
}
