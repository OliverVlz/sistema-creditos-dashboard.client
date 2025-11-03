import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import logoColor from '../../assets/images/ui/logo-color.png'

type Leaf = {
  label: string
  icon?: string
  to: string
}

type Group = {
  title?: string
  items: Array<Leaf>
}

function cn(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(' ')
}

interface SidebarMenuProps {
  onItemClick?: () => void
}

export default function SidebarMenu({ onItemClick }: SidebarMenuProps) {
  // ---- SISTEMA DE CRÉDITOS POR LIBRANZA ----
  const sections: Group[] = useMemo(() => ([

    {
      title: 'Créditos',
      items: [
        { label: 'Dashboard', icon: 'pi pi-home', to: '/dashboard' },
        { label: 'Simulación', icon: 'pi pi-calculator', to: '/dashboard/simulation' },
        { label: 'Mis Solicitudes', icon: 'pi pi-file-text', to: '/dashboard/my-loans' },
      ]
    },
    {
      title: 'Gestión',
      items: [
        { label: 'Clientes', icon: 'pi pi-users', to: '/dashboard/clients' },
        { label: 'Solicitudes', icon: 'pi pi-list', to: '/dashboard/loans' },
        { label: 'Aprobaciones', icon: 'pi pi-check-circle', to: '/dashboard/approvals' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { label: 'Tasas de Interés', icon: 'pi pi-percentage', to: '/dashboard/interest-rates' },
        { label: 'Configuración', icon: 'pi pi-cog', to: '/dashboard/settings' },
        { label: 'Reportes', icon: 'pi pi-chart-bar', to: '/dashboard/reports' },
      ]
    },
    
  ]), [])

  return (
    <div className="flex flex-col h-full bg-theme-sidebar">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-theme-primary pt-4 pb-10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img 
              src={logoColor} 
              alt="Logo Empresa" 
              className="w-auto h-12 object-contain" 
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-3 space-y-6">
          {sections.map((section, si) => (
            <div key={`section-${si}`}>
              {/* Section Title */}
              {section.title && (
                <div className="px-3 mb-3">
                  <span className="text-xs font-semibold tracking-wider uppercase text-theme-muted">
                    {section.title}
                  </span>
                </div>
              )}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLinkItem 
                    key={item.to} 
                    item={item} 
                    onItemClick={onItemClick} 
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-theme-primary">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-theme-secondary text-sm font-medium">Sistema Activo</p>
            <p className="text-theme-muted text-xs">Créditos Libranza v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )

  function NavLinkItem({ item, onItemClick }: { 
    item: Leaf
    onItemClick?: () => void
  }) {
    return (
      <NavLink
        to={item.to}
        onClick={() => {
          onItemClick?.()
        }}
        className={({ isActive }) => cn(
          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
          'hover:bg-theme-tertiary',
          isActive 
            ? 'bg-theme-tertiary text-theme-primary border-r-2 border-theme-accent' 
            : 'text-theme-secondary hover:text-theme-primary'
        )}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {item.icon && (
            <i className={cn(item.icon, 'text-sm')} />
          )}
        </div>
        
        <span className="font-medium text-sm">
          {item.label}
        </span>
      </NavLink>
    )
  }
}