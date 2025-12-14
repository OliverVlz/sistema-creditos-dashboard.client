import HomeBanner from '../components/HomeBanner';
import HomeRequestsPanel from '../components/HomeRequestsPanel';

/**
 * Página de Inicio (Home)
 * Layout dividido: Banner a la izquierda, Panel de solicitudes a la derecha
 */
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start py-3 sm:py-4 md:py-6 lg:py-10 px-3 sm:px-4 lg:px-6 xl:px-0">
      {/* Layout principal: en desktop siempre 2 columnas mitad y mitad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-start w-full max-w-7xl mx-auto">
        {/* Columna Izquierda: Banner */}
        <div className="order-2 lg:order-1 w-full flex justify-center">
          <HomeBanner />
        </div>

        {/* Columna Derecha: Panel de Solicitudes */}
        <div className="order-1 lg:order-2 flex flex-col w-full">
          <HomeRequestsPanel />
        </div>
      </div>
    </div>
  );
}
