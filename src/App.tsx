import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Home from "./pages/Dashboard/Home";
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

export default function App() {
  return (
    <>
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
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/dashboard/gestion-de-usuarios" element={<UserManagementComponent />} />
          <Route path="/dashboard/gestion-de-creditos" element={<CreditManagementComponent />} />
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
    </>
  );
}
