import { useState, useEffect } from 'react';
import { PoliciaHero } from './sections/PoliciaHero';
import { InstitutionContent } from '../../../../components/business/InstitutionContent';

export default function PoliciaNacionalPage() {
  const [userType, setUserType] = useState<'pensionado' | 'activo'>('pensionado');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PoliciaHero />

      <InstitutionContent
        institutionName="la Policía Nacional"
        userType={userType}
        onUserTypeChange={setUserType}
        isPolice={true}
      />
    </div>
  );
}
