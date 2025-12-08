import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchMyProfile } from '../slices/operations/fetchMyProfile.operation';
import ProfileUnifiedCard from '../components/ProfileUnifiedCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },  
            { label: "Mi Perfil" }
          ]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-2xl">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
            Error al cargar el perfil
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            // @ts-expect-error - Redux Toolkit types issue with React 19
            onClick={() => dispatch(fetchMyProfile())}
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            No hay información de perfil
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No se pudo obtener la información del perfil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb 
        showTitle={false}
        items={[
          { label: "Home", path: "/dashboard/home" },  
          { label: "Mi Perfil" }
        ]}
      />
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Mi Perfil
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualiza y edita tu información personal
        </p>
      </div>

      {/* Profile Unified Card */}
      <ProfileUnifiedCard profile={profile} />
    </div>
  );
};

export default ProfilePage;
