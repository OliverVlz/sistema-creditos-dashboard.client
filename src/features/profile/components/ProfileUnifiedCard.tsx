import { useState, useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Dropdown, { DropdownOption } from "../../../components/ui/Dropdown";
import { ProfileData, ProfileUpdateData } from "../models/profileModel";
import { useAppDispatch, useAppSelector } from "../../../store";
import { updateMyProfile } from "../slices/operations/updateMyProfile.operation";
import { fetchMyProfile } from "../slices/operations/fetchMyProfile.operation";
import Swal from "sweetalert2";

interface ProfileUnifiedCardProps {
  profile: ProfileData;
}

export default function ProfileUnifiedCard({ profile }: ProfileUnifiedCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const { updateLoading } = useAppSelector((state) => state.profile);

  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    birthDate: profile.clientInfo?.birthDate || '',
    address: profile.clientInfo?.address || '',
    employmentStatus: profile.clientInfo?.employmentStatus || '',
  });

  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      birthDate: profile.clientInfo?.birthDate || '',
      address: profile.clientInfo?.address || '',
      employmentStatus: profile.clientInfo?.employmentStatus || '',
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof ProfileUpdateData) => {
    return (value: string | number | null | undefined) => {
      setFormData(prev => ({ ...prev, [field]: value as string }));
    };
  };

  const employmentStatusOptions: DropdownOption[] = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'JUBILADO', label: 'Jubilado' }
  ];

  const handleSave = async () => {
    try {
      const result = await dispatch(updateMyProfile(formData));
      
      if (updateMyProfile.fulfilled.match(result)) {
        // Recargar el perfil actualizado
        await dispatch(fetchMyProfile());
        
        // Mostrar mensaje de éxito
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Tu perfil ha sido actualizado correctamente.',
          icon: 'success',
          confirmButtonColor: '#FF8546',
          confirmButtonText: 'Aceptar',
        });
        
        closeModal();
      } else if (updateMyProfile.rejected.match(result)) {
        // Extraer mensaje de error
        let errorMessage = 'Error al actualizar el perfil. Por favor, intenta nuevamente.';
        
        if (result.error && typeof result.error === 'object') {
          const error = result.error as { message?: string; response?: { data?: { message?: string } } };
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
        }
        
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#FF8546',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error: unknown) {
      console.error('Error al actualizar el perfil:', error);
      
      // Intentar extraer el mensaje del error
      let errorMessage = 'Error al actualizar el perfil. Por favor, intenta nuevamente.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#FF8546',
        confirmButtonText: 'Aceptar',
      });
    }
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

  const getEmploymentStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      EMPLEADO: 'Empleado',
      JUBILADO: 'Jubilado',
      INDEPENDIENTE: 'Independiente',
      DESEMPLEADO: 'Desempleado',
      ACTIVO: 'Activo',
    };
    return statusMap[status] || status;
  };

  const organizationName = profile.clientInfo?.organization?.name || 'Sin organización';

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900">
        {/* Header con nombre y badges */}
        <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex items-center justify-center w-16 h-16 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-primary/10">
                <span className="text-xl font-bold text-primary">
                  {profile.firstName?.charAt(0)?.toUpperCase()}
                  {profile.lastName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              
              {/* Nombre y estado */}
              <div>
                <h4 className="mb-1 text-lg font-semibold text-gray-800 capitalize dark:text-white/90">
                  {profile.firstName} {profile.lastName}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getEmploymentStatusLabel(profile.clientInfo?.employmentStatus || '')}
                  </p>
                  <span className="text-gray-400">•</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {organizationName}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Badges de estado y botón editar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
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
              <button
                onClick={openModal}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Editar
              </button>
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Información Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nombre
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                {profile.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                {profile.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Teléfono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile.phoneNumber}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Número de Documento
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile.documentNumber}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Fecha de Nacimiento
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(profile.clientInfo?.birthDate || '')}
              </p>
            </div>

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
                {profile.clientInfo?.organization?.name || 'No asignada'}
              </p>
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div>
          {/* <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Dirección
          </h4> */}

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Dirección de Residencia
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {profile.clientInfo?.address || 'No especificada'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal único para editar toda la información */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar perfil
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos personales y dirección.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Apellido</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Teléfono</Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Estado Laboral</Label>
                  <Dropdown
                    placeholder="Seleccionar estado laboral"
                    options={employmentStatusOptions}
                    value={formData.employmentStatus || undefined}
                    onChange={handleSelectChange('employmentStatus')}
                    disabled={updateLoading}
                  />
                </div>


                <div className="col-span-2">
                  <Label>Dirección</Label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateLoading}>
                {updateLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

