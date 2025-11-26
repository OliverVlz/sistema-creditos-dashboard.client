import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "./AppLayout";

/**
 * Layout protegido que requiere autenticación
 * Todas las rutas que usen este layout requerirán autenticación
 * Equivalente a un Guard en Angular
 */
const ProtectedAppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8546]"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  // Guardar la ruta actual para redirigir después del login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizar el layout con las rutas hijas
  return <AppLayout />;
};

export default ProtectedAppLayout;
