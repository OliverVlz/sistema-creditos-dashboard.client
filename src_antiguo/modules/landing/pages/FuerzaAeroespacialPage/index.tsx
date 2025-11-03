import { useState, useEffect } from 'react';
import { FuerzaAereaHero } from './sections/FuerzaAereaHero';
import { InstitutionContent } from '../../../../components/business/InstitutionContent';

export default function FuerzaAeroespacialPage() {
  const [userType, setUserType] = useState<'pensionado' | 'activo'>('pensionado');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <FuerzaAereaHero />

      <InstitutionContent
        institutionName="la Fuerza Aeroespacial"
        userType={userType}
        onUserTypeChange={setUserType}
      />
    </div>
  );
}
