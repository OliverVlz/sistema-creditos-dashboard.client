import Clients from '../components/clients/clients'

export default function ClientsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-theme-primary">Gestión de Clientes</h1>
        <p className="text-theme-muted mt-2">Administra la base de datos de clientes del sistema</p>
      </div>
      
      <Clients />
    </div>
  )
}
