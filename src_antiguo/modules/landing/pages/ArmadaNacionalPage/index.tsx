import { useState, useEffect } from 'react';
import { ArmadaHero } from './sections/ArmadaHero';
import { InstitutionContent } from '../../../../components/business/InstitutionContent';

export default function ArmadaNacionalPage() {
  const [userType, setUserType] = useState<'pensionado' | 'activo'>('pensionado');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ArmadaHero />

      <InstitutionContent
        institutionName="la Armada Nacional"
        userType={userType}
        onUserTypeChange={setUserType}
      />
    </div>
  );
}
