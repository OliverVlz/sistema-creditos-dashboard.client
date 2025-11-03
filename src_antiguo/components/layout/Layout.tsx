import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { useState } from 'react'
import SidebarMenu from './SidebarMenu'
import { useTheme } from '../../hooks/useTheme'

export default function Layout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toggleTheme, isLight } = useTheme()

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50 w-80 md:w-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-theme-sidebar backdrop-blur-xl border-r border-theme-primary
          shadow-2xl md:shadow-none
        `}>
          <div className="h-full bg-theme-sidebar">
            <SidebarMenu onItemClick={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col min-w-0 relative">
          {/* Topbar */}
          <header className="sticky top-0 z-30 bg-theme-header backdrop-blur-xl border-b border-theme-primary">
            <div className="flex items-center justify-between px-6 h-16">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <Button 
                  icon="pi pi-bars" 
                  text 
                  size="large"
                  className="md:hidden text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary p-2"
                  onClick={() => setSidebarOpen(true)}
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-theme-primary">Créditos Libranza</h1>
                  <span className="text-sm text-theme-muted hidden sm:block">Sistema de préstamos</span>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle Button */}
                <Button 
                  icon={isLight ? "pi pi-moon" : "pi pi-sun"} 
                  text 
                  size="large"
                  className="text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary p-2"
                  tooltip={isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
                  onClick={toggleTheme}
                />
                
                {/* Search Button */}
                <Button 
                  icon="pi pi-search" 
                  text 
                  size="large"
                  className="text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary p-2"
                  tooltip="Buscar"
                />
                
                {/* Notifications */}
                <div className="relative">
                  <Button 
                    icon="pi pi-bell" 
                    text 
                    size="large"
                    className="text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary p-2"
                    tooltip="Notificaciones"
                  />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-700 mx-2"></div>

                {/* Profile Menu */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-theme-primary">Admin User</p>
                    <p className="text-xs text-theme-muted">Administrador</p>
                  </div>
                  
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-theme-tertiary transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i className="pi pi-user text-white text-sm"></i>
                      </div>
                      <i className="pi pi-chevron-down text-theme-muted text-xs hidden sm:block"></i>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-theme-card rounded-lg shadow-theme-lg border border-theme-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-md transition-colors flex items-center gap-2"
                          onClick={() => navigate('/dashboard/profile')}
                        >
                          <i className="pi pi-user"></i>
                          Mi Perfil
                        </button>
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-md transition-colors flex items-center gap-2"
                          onClick={() => navigate('/dashboard/settings')}
                        >
                          <i className="pi pi-cog"></i>
                          Configuración
                        </button>
                        <hr className="my-2 border-theme-primary" />
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-md transition-colors flex items-center gap-2"
                          onClick={() => navigate('/')}
                        >
                          <i className="pi pi-home"></i>
                          Ir al Landing
                        </button>
                        <hr className="my-2 border-theme-primary" />
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-2"
                          onClick={() => navigate('/login')}
                        >
                          <i className="pi pi-sign-out"></i>
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <section className="flex-1 p-6 bg-theme-secondary min-h-[calc(100vh-4rem)]">
            <div className="max-w-full mx-auto">
              <Outlet />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}