import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedAppLayout from "./layout/ProtectedAppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { RoleProtectedRoute } from "./routes/components/RoleProtectedRoute";
import { UserRole } from "./types/roles";

import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import NotFound from "./pages/OtherPage/NotFound";

import RebuiltDashboard from "./pages/Dashboard/RebuiltDashboard";
import ClientsPage from "./pages/ClientsPage";
import LandingLayout from "./components/layout/LandingLayout";
import HomePage from "./modules/landing/pages/HomePage";
import ServicesPage from "./modules/landing/pages/ServicesPage";
import AboutPage from "./modules/landing/pages/AboutPage";
import RegisterPage from "./modules/landing/pages/RegisterPage";
import LoginPage from "./modules/landing/pages/LoginPage";
import EjercitoNacionalPage from "./modules/landing/pages/EjercitoNacionalPage";
import ArmadaNacionalPage from "./modules/landing/pages/ArmadaNacionalPage";
import FuerzaAeroespacialPage from "./modules/landing/pages/FuerzaAeroespacialPage";
import PoliciaNacionalPage from "./modules/landing/pages/PoliciaNacionalPage";
import UserManagementComponent from "./features/user-management/pages/user-management.component";
import CreditManagementComponent from "./features/credit-management/pages/credit-managment";   
import FormCreateUser from "./features/user-management/pages/form-create-user";
import { store } from "./store";
import { Provider } from "react-redux";
import CustomerManagementComponent from "./features/customer-management/pages/customer-management";
import FormCreateClient from "./features/customer-management/pages/form-create-client";
import Login from "./features/auth/pages/login";
import FormEditUser from "./features/user-management/pages/form-edit-user";
import FormEditClient from "./features/customer-management/pages/form-edit-client";
import Home from "./features/home/pages/home";
import { ProfilePage } from "./features/profile/pages/profilePage";
import ChangePasswordPage from "./features/auth/pages/change-password";
import LoanRequestsPage from "./features/loan-requests/pages/loan-requests";
import LoanRequestDetailPage from "./features/loan-requests/pages/loan-request-detail";
import LoanTypesPage from "./features/loan-types/pages/loan-types";

export default function App() {
  return (
    <Provider store={store}>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/ejercito-nacional" element={<EjercitoNacionalPage />} />
          <Route path="/armada-nacional" element={<ArmadaNacionalPage />} />
          <Route path="/fuerza-aeroespacial" element={<FuerzaAeroespacialPage />} />
          <Route path="/policia-nacional" element={<PoliciaNacionalPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login2" element={<Login />} />
        </Route>

        <Route element={<ProtectedAppLayout />}>
          {/* Rutas accesibles para todos los roles autenticados */}
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard/mi-perfil" element={<ProfilePage />} />
          <Route path="/dashboard/cambiar-contrasena" element={<ChangePasswordPage />} />

          {/* Rutas solo para ADMIN - Gestión de Usuarios */}
          <Route
            path="/dashboard/gestion-de-usuarios"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <UserManagementComponent />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard/crear-usuario"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <FormCreateUser />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/gestion-de-usuarios/editar-usuario/:id"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <FormEditUser />
              </RoleProtectedRoute>
            }
          />

          {/* Rutas solo para ADMIN - Tipos de Préstamo */}
          <Route
            path="/tipos-prestamo"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <LoanTypesPage />
              </RoleProtectedRoute>
            }
          />

          {/* Rutas para ADMIN y ASESOR - Gestión de Créditos */}
          <Route
            path="/dashboard/gestion-de-creditos"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CLIENTE]}>
                <CreditManagementComponent />
              </RoleProtectedRoute>
            }
          />

          {/* Rutas para ADMIN y ASESOR - Gestión de Solicitudes */}
          <Route
            path="/gestion-solicitudes"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE]}>
                <LoanRequestsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/gestion-solicitudes/detalle/:id"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR, UserRole.CLIENTE]}>
                <LoanRequestDetailPage />
              </RoleProtectedRoute>
            }
          />

          {/* Rutas para ADMIN y ASESOR - Gestión de Clientes */}
          <Route
            path="/gestion-de-clientes"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR]}>
                <CustomerManagementComponent />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/gestion-de-clientes/crear-cliente"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR]}>
                <FormCreateClient />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/gestion-de-clientes/editar-cliente/:id"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASESOR]}>
                <FormEditClient />
              </RoleProtectedRoute>
            }
          />

          {/* Rutas solo para CLIENTE - Mis Solicitudes */}
          <Route
            path="/mis-solicitudes"
            element={
              <RoleProtectedRoute allowedRoles={[UserRole.CLIENTE]}>
                <Blank /> {/* TODO: Crear página de solicitudes del cliente */}
              </RoleProtectedRoute>
            }
          />

          {/* Rutas legacy/template (mantener acceso general) */}
          <Route path="/dashboard" element={<RebuiltDashboard />} />
          <Route path="/dashboard/clients" element={<ClientsPage />} />
          <Route path="/dashboard/loan-application" element={<Blank />} />
          <Route path="/dashboard/simulation" element={<Blank />} />
          <Route path="/dashboard/my-loans" element={<Blank />} />
          <Route path="/dashboard/loans" element={<Blank />} />
          <Route path="/dashboard/approvals" element={<Blank />} />
          <Route path="/dashboard/interest-rates" element={<Blank />} />
          <Route path="/dashboard/settings" element={<Blank />} />
          <Route path="/dashboard/reports" element={<Blank />} />

          <Route path="/dashboard/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ecommerce" element={<Home />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}
