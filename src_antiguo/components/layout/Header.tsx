import Button from '../ui/Button';
import logoColor from '../../assets/images/ui/logo-color.png';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveSection = (sectionId: string) => {
    if (location.pathname === '/') {
      return sectionId === 'inicio';
    }
    return location.pathname.includes(sectionId);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Si no estamos en la página principal, navegamos primero
      navigate('/');
      // Después de navegar, esperamos más tiempo para que se cargue la página
      setTimeout(() => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Si no encuentra el elemento, intentamos de nuevo con más delay
          setTimeout(() => {
            const contactSectionRetry = document.getElementById('contacto');
            if (contactSectionRetry) {
              contactSectionRetry.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        }
      }, 500);
    } else {
      // Si ya estamos en la página principal, solo hacemos scroll
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="w-full border-b border-slate-200 bg-global-11">
      <div className="mx-auto flex h-20 items-center justify-between max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoColor}
            alt="Logo"
            className="h-14 w-14 cursor-pointer"
          />
          <span className="sr-only">Sistema de Créditos</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className={isActiveSection('inicio') ? 'nav-link-active' : 'nav-link-default'}
          >
            Inicio
          </Link>
          <div className="relative">
            <button
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setIsServicesDropdownOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsServicesDropdownOpen(false);
                }, 150);
                setDropdownTimeout(timeout);
              }}
              className={`flex items-center gap-1 ${isActiveSection('servicios') ? 'nav-link-active' : 'nav-link-default'}`}
            >
              Servicios
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isServicesDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                onMouseEnter={() => {
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setIsServicesDropdownOpen(false);
                  }, 150);
                  setDropdownTimeout(timeout);
                }}
              >
                {/* Todos nuestros servicios */}
                <Link
                  to="/servicios"
                  className="text-sm text-gray-700 hover:text-orange-600 transition-colors border-b border-gray-100 cursor-pointer"
                >
                  <div className="py-3 px-6">
                    <div className="font-medium">Todos nuestros servicios</div>
                    <div className="text-xs text-gray-500 mt-1">Conoce todas las opciones disponibles</div>
                  </div>
                </Link>

                {/* Créditos por Libranza */}
                <div className="relative z-10 bg-orange-50/60 rounded mx-auto">
                  <div className="flex items-center gap-1 text-xs py-3 font-semibold text-button-background1/80 uppercase tracking-wide px-6">
                    Créditos por Libranza
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <Link
                  to="/ejercito-nacional"
                  className="text-sm text-gray-700 hover:text-green-700 transition-colors cursor-pointer"
                >
                  <div className="py-3 px-6">
                    <div className="font-medium">Ejército Nacional</div>
                    <div className="text-xs text-gray-500 mt-1">Créditos para personal militar</div>
                  </div>
                </Link>

                <Link
                  to="/armada-nacional"
                  className="text-sm text-gray-700 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <div className="py-3 px-6">
                    <div className="font-medium">Armada Nacional</div>
                    <div className="text-xs text-gray-500 mt-1">Créditos para personal naval</div>
                  </div>
                </Link>

                <Link
                  to="/fuerza-aeroespacial"
                  className="text-sm text-gray-700 hover:text-sky-700 transition-colors cursor-pointer"
                >
                  <div className="py-3 px-6">
                    <div className="font-medium">Fuerza Aeroespacial</div>
                    <div className="text-xs text-gray-500 mt-1">Créditos para personal aéreo</div>
                  </div>
                </Link>

                <Link
                  to="/policia-nacional"
                  className="text-sm text-gray-700 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <div className="py-3 px-6">
                    <div className="font-medium">Policía Nacional</div>
                    <div className="text-xs text-gray-500 mt-1">Créditos para personal policial</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/sobre-nosotros"
            className={isActiveSection('sobre-nosotros') ? 'nav-link-active' : 'nav-link-default'}
          >
            Sobre nosotros
          </Link>
          <button
            onClick={handleContactClick}
            className={`${isActiveSection('contacto') ? 'nav-link-active' : 'nav-link-default'} cursor-pointer`}
          >
            Contáctanos
          </button>

          <span className="h-5 w-px bg-global-3" aria-hidden="true" />

          <Link
            to="/registro"
            className="nav-link-register"
          >
            Regístrate
          </Link>

          <Link to="/login">
            <Button variant="primary" size="medium">
              Ingresar
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-md transition-colors hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-6 space-y-4">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>

            <div className="space-y-2">
              <div className="font-medium text-gray-900 py-2">Servicios</div>
              <Link
                to="/servicios"
                className="block py-2 pl-4 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Todos nuestros servicios
              </Link>

              <div className="py-2 text-xs font-semibold text-gray-600 uppercase bg-orange-50/50 rounded">
                Créditos por Libranza
              </div>

              <Link
                to="/ejercito-nacional"
                className="block py-2 pl-4 text-sm text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ejército Nacional
              </Link>

              <Link
                to="/armada-nacional"
                className="block py-2 pl-4 text-sm text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Armada Nacional
              </Link>

              <Link
                to="/fuerza-aeroespacial"
                className="block py-2 pl-4 text-sm text-gray-700 hover:text-sky-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fuerza Aeroespacial
              </Link>

              <Link
                to="/policia-nacional"
                className="block py-2 pl-4 text-sm text-gray-700 hover:text-red-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Policía Nacional
              </Link>
            </div>

            <Link
              to="/sobre-nosotros"
              className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre nosotros
            </Link>

            <button
              onClick={(e) => {
                handleContactClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block py-2 text-gray-700 hover:text-orange-600 transition-colors text-left"
            >
              Contáctanos
            </button>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link
                to="/registro"
                className="block py-2 text-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Regístrate
              </Link>

              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="primary" size="medium" className="w-full">
                  Ingresar
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

