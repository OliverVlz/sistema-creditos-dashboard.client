import UserTable from '../components/userTable'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import SearchUsers from '../components/SearchUsers'

const UserManagementComponent = () => {
  return (
    <div className="space-y-6">
      {/* Header con Título y Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Gestión de Usuarios
        </h1>
        <PageBreadcrumb 
          showTitle={false}
          items={[
            { label: "Home", path: "/dashboard" },
            { label: "Gestión de Usuarios" }
          ]}
        />
      </div>

      {/* Filtros de búsqueda */}
      <SearchUsers />  

      {/* Tabla de usuarios */}
      <div className="mt-6">
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagementComponent;