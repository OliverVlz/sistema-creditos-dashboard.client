import UserTable from '../components/userTable'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import SearchClient from '../components/SearchClient'

const UserManagementComponent = () => {
  return (
    <div>
      <PageBreadcrumb 
        pageTitle="Gestión de Usuarios"
        items={[
          { label: "Home", path: "/dashboard" },
          { label: "Gestión de Usuarios" }
        ]}
      />
      <SearchClient />
      <UserTable />
    </div>
  );
};

export default UserManagementComponent;