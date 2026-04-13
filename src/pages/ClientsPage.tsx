import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ClientTable from "../components/clients/ClientTable";
import PageMeta from "../components/common/PageMeta";

export default function ClientsPage() {
  return (
    <>
      <PageMeta description="Gestión de clientes" title="Gestión de clientes" />  
      <PageBreadcrumb pageTitle="Gestión de clientes" />
      <div className="space-y-6">
        <ClientTable />
      </div>
    </>
  );
}
