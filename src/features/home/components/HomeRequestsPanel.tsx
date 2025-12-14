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
  const { user, loading: authLoading } = useAuth();
  const { isCliente, isAdmin, isAsesor } = useRoleAccess();
  
  const { loanRequests, loading } = useAppSelector((state) => state.loanRequests);
  const { profile, loading: profileLoading } = useAppSelector((state) => state.profile);
  
  // Verificar si el profile corresponde al usuario actual
  const isProfileValid = profile && user && profile.id === user.id;
  
  // Obtener clientId del perfil cuando es cliente (solo si el profile es válido)
  const clientId = !authLoading && isCliente && isProfileValid && profile?.clientInfo 
    ? profile.clientInfo.id 
    : undefined;

  // Cargar perfil si es cliente y el profile no existe o no corresponde al usuario actual
  useEffect(() => {
    if (!authLoading && isCliente && user && !profileLoading) {
      // Cargar si no hay profile o si el profile es de otro usuario
      if (!profile || profile.id !== user.id) {
        // @ts-expect-error - Redux Toolkit types issue with React 19
        dispatch(fetchMyProfile());
      }
    }
  }, [authLoading, isCliente, user, profile, profileLoading, dispatch]);

  // Cargar solicitudes
  useEffect(() => {
    // Esperar a que cargue la autenticación
    if (authLoading) return;
    
    // Si es cliente, esperar el clientId válido
    if (isCliente && !clientId) return;

    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchLoanRequests({ 
      page: 1, 
      limit: 10,
      clientId: clientId 
    }));
  }, [dispatch, clientId, isCliente, authLoading]);

  // Loading state - esperar hasta que tengamos un clientId válido para clientes
  if (loading || (isCliente && !clientId) || (isCliente && profileLoading)) {
    return (
      <div className="flex items-center justify-center h-40 sm:h-48 md:h-64">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 border-b-2 border-[#FF8546]"></div>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  // Para CLIENTE: Si no tiene solicitudes, mostrar estado vacío
  if (isCliente && loanRequests.length === 0) {
    return <EmptyClientState />;
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header del panel */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {isCliente ? 'Mis Solicitudes' : 'Gestión de Solicitudes'}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
            {isCliente 
              ? 'Revisa el estado de tus créditos' 
              : 'Resumen de solicitudes del sistema'}
          </p>
        </div>

        {/* Botones de acción según rol */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
          {isCliente && (
            <Link
              to="/dashboard/gestion-de-creditos"
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#FF8546] to-[#ff6b2b] hover:from-[#ff6b2b] hover:to-[#FF8546] text-white text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-100"
            >
              <span>Nueva Solicitud</span>
            </Link>
          )}
          
          <Link
            to="/gestion-solicitudes"
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
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
