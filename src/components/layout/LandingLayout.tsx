import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from '../common/Footer';

interface LandingLayoutProps {
  children?: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-global-11">
      <Header />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

