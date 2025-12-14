import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchClientInformation } from '../slices/operations/fetchClientInformation.operation';
import { nextStep, previousStep } from '../slices/creditManagement';
import { RootState, useAppSelector } from '@/store'; 

// --- ICONOS ---
/* const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
); */

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const ClientInformationComponent: React.FC = () => {
  const dispatch = useDispatch();
  
  const { clientInformation, loading, error } = useAppSelector((state: RootState) => state.creditManagement);

  useEffect(() => {
    dispatch(fetchClientInformation());
  }, [dispatch]);

/*   const handleEditProfile = () => {
    // TODO: Navegar a edición de perfil si es necesario
    console.log('Editar perfil');
  }; */

  const handleNextStep = () => {
    dispatch(nextStep());
  };

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  // Componente auxiliar para las filas
  const InfoRow = ({ label, value }: { label: string; value: string | undefined | null }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 py-2 sm:py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 group">
      <dt className="text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 flex items-center">
        {label}
      </dt>
      <dd className="text-sm sm:text-base font-semibold text-gray-900 sm:col-span-2 mt-1 sm:mt-0 break-words group-hover:text-blue-900 transition-colors">
        {value || '---'}
      </dd>
    </div>
  );

  // --- ESTADO DE CARGA ---
  if (loading) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 w-full animate-pulse">
        <div className="flex justify-between mb-6 sm:mb-8">
           <div className="h-6 sm:h-8 w-36 sm:w-48 bg-gray-200 rounded-lg"></div>
           <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-3 sm:space-y-4">
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="h-8 sm:h-10 w-full bg-gray-100 rounded-lg"></div>
           ))}
        </div>
      </div>
    );
  }

  // --- ESTADO DE ERROR ---
  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-red-100 text-center">
        <p className="text-sm sm:text-base text-red-600 font-medium mb-3 sm:mb-4">No pudimos cargar tu información</p>
        <button 
          onClick={() => dispatch(fetchClientInformation())}
          className="text-xs sm:text-sm text-red-700 underline hover:text-red-900"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // --- COMPONENTE PRINCIPAL ---
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative mx-auto w-full">
      
      {/* HEADER: Título y Botón Editar */}
      <div className="flex justify-between items-start mb-4 sm:mb-5 lg:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800 tracking-tight font-plus-jakarta">
            Información de cliente
          </h2>
          {clientInformation && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hola, {clientInformation.firstName} {clientInformation.lastName}
            </p>
          )}
        </div>
        
        {/* <button 
          onClick={handleEditProfile}
          className="group flex flex-col items-center justify-center text-blue-600 hover:text-blue-700 transition-colors ml-4"
          title="Editar información"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all border border-blue-100 group-hover:shadow-sm">
            <EditIcon />
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide opacity-70 group-hover:opacity-100">Editar</span>
        </button> */}
      </div>

      {/* BODY: Lista de Datos */}
      {clientInformation && (
        <dl className="space-y-1 mb-4 sm:mb-6 lg:mb-8 bg-white rounded-2xl">
          {/* Cédula */}
          <InfoRow 
            label="Cédula" 
            value={clientInformation.documentNumber} 
          />
          
          {/* Correo */}
          <InfoRow 
            label="Correo electrónico" 
            value={clientInformation.email} 
          />
          
          {/* Teléfono */}
          <InfoRow 
            label="Número de teléfono" 
            value={clientInformation.phoneNumber} 
          />
          
          {/* Entidad (Organización) - Acceso profundo */}
          <InfoRow 
            label="Entidad / Organización" 
            value={clientInformation.clientInfo?.organization?.name} 
          />
          
          {/* Estado (Pensionado o no) */}
          <InfoRow 
            label="Estado Laboral" 
            value={clientInformation.clientInfo?.employmentStatus} 
          />
        </dl>
      )}

      {/* FOOTER: Botones Navegación */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
        <button
          onClick={handlePreviousStep}
          className="h-11 sm:h-12 px-5 sm:px-6 w-full sm:w-auto flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group font-semibold text-sm"
        >
          <div className="mr-2 transform group-hover:-translate-x-1 transition-transform">
             <ArrowLeftIcon />
          </div>
          <span>Volver</span>
        </button>
        <button
          onClick={handleNextStep}
          className="h-11 sm:h-12 px-5 sm:px-6 w-full sm:w-auto flex items-center justify-center rounded-xl border-2 border-transparent bg-gray-50 text-gray-600 hover:bg-orange-600 hover:text-white transition-all duration-300 group font-semibold text-sm"
        >
          <span>Continuar</span>
          <div className="ml-2 transform group-hover:translate-x-1 transition-transform">
             <ArrowRightIcon />
          </div>
        </button>
      </div>
    </div>
  );
};