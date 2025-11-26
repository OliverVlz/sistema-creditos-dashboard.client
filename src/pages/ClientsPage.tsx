import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ClientTable from "../components/clients/ClientTable";
import PageMeta from "../components/common/PageMeta";

export default function ClientsPage() {
  return (
    <>
      <PageMeta description="Gestión de Clientes" title="Gestión de Clientes" />  
      <PageBreadcrumb pageTitle="Gestión de Clientes" />
      <div className="space-y-6">
        <ClientTable />
      </div>
    </>
  );
}
