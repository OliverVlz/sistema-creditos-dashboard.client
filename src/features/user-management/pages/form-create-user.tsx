import React from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import FormUsers from '../components/formUsers';
import { FormCreateUserProps } from '../models/formUserModel';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useNavigate } from 'react-router-dom';
 


const FormCreateUser: React.FC<FormCreateUserProps> = ({ initialData }) => {
  const navigate = useNavigate();
 
  const handleSuccess = () => {
     navigate('/dashboard/gestion-de-usuarios');
 };

  const handleError = (error: Error) => {
    console.error('Error al guardar usuario:', error);
  };

  return (
    
    <div className="p-3 sm:p-4 lg:p-6">
    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Crear Usuario</h1>
    <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: "Gestión de usuarios", path: "/dashboard/gestion-de-usuarios" },
            {label: "Crear Usuario"}
          ]}
        />
      <FormUsers 
        initialData={initialData}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default FormCreateUser;
