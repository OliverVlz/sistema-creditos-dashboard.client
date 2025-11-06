import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ClientTable from '../components/clientTable';
import SearchClient from '../components/SearchClient';
const CustomerManagementComponent = () => {
  return (
    <div className="space-y-6">
      {/* Header con Título y Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Gestión de Clientes
        </h1>
        <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard" },
            { label: "Gestión de Clientes" }
          ]}
        />
      </div>

      {/* Filtros de búsqueda */}
      <SearchClient />  

      {/* Tabla de clientes */}
      <div className="mt-6">
        <ClientTable />
      </div>
    </div>
  );
};

export default CustomerManagementComponent;