import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import LoanRequestsTable from '../components/LoanRequestsTable';
import SearchLoanRequests from '../components/SearchLoanRequests';
import { useAuth } from '../../../hooks/useAuth';

const LoanRequestsPage = () => {
  const { user } = useAuth();
  
  // Determinar si el usuario es cliente para personalizar el título
  const isClient = user?.role === 'CLIENTE';

  return (
    <div className="space-y-6">
      {/* Header con Título y Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {isClient ? 'Mis Solicitudes de Crédito' : 'Gestión de Solicitudes'}
        </h1>
        <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard/home" },
            { label: isClient ? "Mis Solicitudes" : "Gestión de Solicitudes" }
          ]}
        />
      </div>

      {/* Filtros de búsqueda (maneja la carga del perfil internamente) */}
      <SearchLoanRequests />  

      {/* Tabla de solicitudes */}
      <div className="mt-6">
        <LoanRequestsTable />
      </div>
    </div>
  );
};

export default LoanRequestsPage;
