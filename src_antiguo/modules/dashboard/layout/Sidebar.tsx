import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  {
    name: 'Resumen',
    href: '/dashboard',
    icon: '🏠'
  },
  {
    name: 'Solicitar Crédito',
    href: '/dashboard/loan-application',
    icon: '📝'
  },
  {
    name: 'Simular Crédito',
    href: '/dashboard/simulation',
    icon: '🧮'
  },
  {
    name: 'Clientes',
    href: '/dashboard/clients',
    icon: '👥'
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Sistema de Créditos</h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
