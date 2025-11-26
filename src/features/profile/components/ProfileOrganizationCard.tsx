import { ProfileData } from "../models/profileModel";

interface ProfileOrganizationCardProps {
  profile: ProfileData;
}

export default function ProfileOrganizationCard({ profile }: ProfileOrganizationCardProps) {
  const organization = profile.clientInfo?.organization;

  const getEmploymentStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      EMPLEADO: 'Empleado',
      JUBILADO: 'Jubilado',
      INDEPENDIENTE: 'Independiente',
      DESEMPLEADO: 'Desempleado',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Información Laboral
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Estado Laboral
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getEmploymentStatusLabel(profile.clientInfo?.employmentStatus || '')}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Organización
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {organization?.name || 'No asignada'}
              </p>
            </div>

            {organization && (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Tasa de Interés Base
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {organization.baseInterestRate}%
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Tasa de Descuento
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {organization.discountRate}%
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Tasa de Impuesto
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {organization.taxRate}%
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Estado de Organización
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    organization.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {organization.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Información de la cuenta */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Información de la Cuenta
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Fecha de Registro
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(profile.createdAt)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Última Actualización
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(profile.updatedAt)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Préstamos Activos
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile.clientInfo?.loans?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

