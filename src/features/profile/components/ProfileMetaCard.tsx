import { ProfileData } from "../models/profileModel";

interface ProfileMetaCardProps {
  profile: ProfileData;
}

export default function ProfileMetaCard({ profile }: ProfileMetaCardProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const organizationName = profile.clientInfo?.organization?.name || 'Sin organización';

  const getEmploymentStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      EMPLEADO: 'Empleado',
      JUBILADO: 'Jubilado',
      INDEPENDIENTE: 'Independiente',
      DESEMPLEADO: 'Desempleado',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          {/* Avatar */}
          <div className="flex items-center justify-center w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-primary/10">
            <span className="text-2xl font-bold text-primary">
              {profile.firstName?.charAt(0)?.toUpperCase()}
              {profile.lastName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          
          {/* Info principal */}
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 capitalize dark:text-white/90 xl:text-left">
              {fullName}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getEmploymentStatusLabel(profile.clientInfo?.employmentStatus || '')}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {organizationName}
              </p>
            </div>
          </div>
          
          {/* Badge de estado */}
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
              profile.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {profile.isActive ? 'Activo' : 'Inactivo'}
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {profile.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

