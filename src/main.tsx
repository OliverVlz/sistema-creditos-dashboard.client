import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Estilos de PrimeReact (NECESARIOS PARA LA TABLA)
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Estilos del template y dependencias
import './index.css';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';

import { AppWrapper } from './components/common/PageMeta';

// Proveedor de Tema del template
import { ThemeProvider } from './context/ThemeContext';

// Proveedores de lógica del proyecto antiguo
import { AppProviders } from './providers/app-providers';

// Componente principal de la App
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper>
        <ThemeProvider>
          <AppProviders>
            <App />
          </AppProviders>
        </ThemeProvider>
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>,
);