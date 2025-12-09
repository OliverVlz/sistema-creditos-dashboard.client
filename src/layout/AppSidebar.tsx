import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ChevronDownIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { LogoComponent } from "../share/components/logoComponent/logoComponent";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { NavItem, getFilteredMenuItems } from "../config/sidebarConfig";
import { useAuth } from "../hooks/useAuth";
import { LOGIN_ROUTE, CHANGE_PASSWORD_ROUTE } from "../routes/routes";
import { clearAuthData } from "../core/services/auth.service";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, toggleMobileSidebar } = useSidebar();
  const { userRole } = useRoleAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filtrar items del menú según el rol del usuario
  const menuItems = useMemo(() => {
    return getFilteredMenuItems(userRole);
  }, [userRole]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    menuItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "app", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, menuItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const handleLogout = () => {
    // Limpiar localStorage y navegar inmediatamente
    clearAuthData();
    // Recargar la página para limpiar todo el estado de Redux
    window.location.href = LOGIN_ROUTE;
  };

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.email ?? "Usuario";

  const displayRole =
    userRole === "ADMIN"
      ? "Administrador"
      : userRole === "ASESOR"
      ? "Asesor"
      : userRole === "CLIENTE"
      ? "Cliente"
      : "Usuario";

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  return (
    <aside
      className={`fixed mt-0 flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* Header del sidebar con botón de cerrar para móvil */}
      <div className="flex items-center justify-between py-4 lg:hidden">
        <Link to="/home">
          <LogoComponent className="w-12 h-12" />
        </Link>
        <button
          onClick={toggleMobileSidebar}
          className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cerrar menú"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Logo para desktop */}
      <div
        className={`py-8 hidden lg:flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
        <Link to="/home">
          {isExpanded || isHovered ? (
            <LogoComponent className="w-20 h-20 center" />
          ) : (
            <LogoComponent className="w-10 h-10 justify-center" />
          )}
        </Link>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              {/* SECCIÓN DE LA APLICACIÓN - Items filtrados por rol */}
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Aplicación"
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(menuItems, "app")}
              </div>
            </div>
          </nav>
        </div>

        {/* Sección inferior: usuario actual */}
        <div className="pb-6 pt-4 border-t border-gray-100 dark:border-gray-800 relative">
          {/* Menú desplegable hacia arriba */}
          {isUserMenuOpen && (isExpanded || isHovered || isMobileOpen) && (
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg text-sm overflow-hidden z-10">
              <button
                type="button"
                onClick={() => {
                  navigate(CHANGE_PASSWORD_ROUTE);
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
              >
                Cambiar mi contraseña
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleUserMenuToggle}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
              isUserMenuOpen
                ? "bg-brand-50 text-gray-900"
                : "hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-50 text-brand-500">
              <UserCircleIcon className="w-5 h-5" />
            </div>
            {(isExpanded || isHovered || isMobileOpen) && (
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {displayRole}
                </span>
              </div>
            )}
            {(isExpanded || isHovered || isMobileOpen) && (
              <ChevronDownIcon
                className={`ml-auto w-4 h-4 text-gray-400 transition-transform ${
                  isUserMenuOpen ? "" : "rotate-180"
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
