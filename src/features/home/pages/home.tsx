import HomeBanner from '../components/HomeBanner';
import HomeRequestsPanel from '../components/HomeRequestsPanel';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-start px-3 py-3 sm:px-4 sm:py-4 md:py-6 lg:px-6 lg:py-10 xl:px-0">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        <div className="order-2 flex min-h-[220px] w-full lg:order-1 lg:min-h-[min(560px,calc(100vh-200px))]">
          <HomeBanner />
        </div>
        <div className="order-1 flex min-h-[220px] w-full flex-col lg:order-2 lg:min-h-[min(560px,calc(100vh-200px))]">
          <HomeRequestsPanel />
        </div>
      </div>
    </div>
  );
}
