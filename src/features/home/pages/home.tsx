import HomeBanner from '../components/HomeBanner';
import HomeRequestsPanel from '../components/HomeRequestsPanel';

/**
 * Página de Inicio (Home)
 * Layout dividido: Banner a la izquierda, Panel de solicitudes a la derecha
 */
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center py-6 lg:py-10">
      {/* Layout principal: en desktop siempre 2 columnas mitad y mitad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-stretch w-full">
        {/* Columna Izquierda: Banner */}
        <div className="order-2 lg:order-1 h-full flex justify-center lg:justify-start pt-10">
          <HomeBanner />
        </div>

        {/* Columna Derecha: Panel de Solicitudes */}
        <div className="order-1 lg:order-2 h-full flex flex-col pt-15">
          <HomeRequestsPanel />
        </div>
      </div>
    </div>
  );
}
