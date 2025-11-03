import { Routes, Route, Navigate } from "react-router-dom";

// Layout principal del Template
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// --- Páginas del Template ---
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
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

// --- Páginas de Tu Aplicación ---
import RebuiltDashboard from "./pages/Dashboard/RebuiltDashboard";
import ClientsPage from "./pages/ClientsPage";


// Placeholder simple para la página de login de tu app
function CustomLoginPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Login de Sistema de Créditos</h1>
      <a href="/dashboard">Ir al Dashboard</a>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- Rutas de Autenticación (Públicas) --- */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<CustomLoginPage />} />

        {/* --- Rutas dentro del Layout Principal --- */}
        <Route element={<AppLayout />}>
          {/* Ruta principal del template */}
          <Route index path="/" element={<Navigate to="/dashboard" replace />} />

          {/* --- Rutas del Sistema de Créditos --- */}
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

          {/* --- Páginas del Template --- */}
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

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}