import React from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import FormUsers from '../components/formUsers';
import { FormCreateUserProps } from '../models/formUserModel';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
 


const FormCreateUser: React.FC<FormCreateUserProps> = ({ initialData }) => {
/*   const navigate = useNavigate();
 */
  const handleSuccess = () => {
    console.log('Usuario guardado exitosamente');
/*     navigate('/dashboard/gestion-de-usuarios');
 */  };

  const handleError = (error: Error) => {
    console.error('Error al guardar usuario:', error);
  };

  return (
    
    <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Crear Usuario</h1>
    <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard" },
            { label: "Gestión de Usuarios", path: "/dashboard/gestion-de-usuarios" },
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