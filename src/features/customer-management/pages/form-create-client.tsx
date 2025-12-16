import FormClient from '../components/formClient';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function FormCreateClient() {
  const handleSuccess = () => {
    console.log('Cliente creado exitosamente');
  }

  const handleError = (error: Error) => {
    console.error('Error al crear cliente:', error);
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Crear Cliente</h1>
      <PageBreadcrumb 
        showTitle={false}
        items={[
          { label: "Home", path: "/dashboard/home" },
          { label: "Gestión de Clientes", path: "/gestion-de-clientes" },
          { label: "Crear Cliente" }
        ]}
      />
    <FormClient 
      onSuccess={handleSuccess}
      onError={handleError}
    />
    </div>
  );
}
