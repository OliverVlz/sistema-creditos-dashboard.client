export default function Dashboard() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h1 className="text-3xl font-bold text-theme-primary mb-2">
            Sistema de Créditos por Libranza
          </h1>
          <p className="text-theme-muted">
            Plataforma para gestión de préstamos a personal activo y pensionado de las Fuerzas Armadas Colombianas
          </p>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="pi pi-file-text text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes Activas</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="pi pi-check-circle text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados Hoy</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="pi pi-clock text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">16</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <i className="pi pi-users text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl text-white p-6">
          <h2 className="text-xl font-bold mb-2">Información Importante</h2>
          <p className="text-blue-100">
            Todos los documentos y datos personales son manejados bajo estricto cumplimiento de la Ley 1581 de 2012 (Habeas Data).
            La plataforma garantiza la seguridad y confidencialidad de la información sensible.
          </p>
        </div>
      </div>
    )
  }
  