import PersonalInfoSection from './sections/PersonalInfoSection.js';
import DocumentUploadSection from './sections/DocumentUploadSection.js';
import LoanDetailsSection from './sections/LoanDetailsSection.js';
import ReviewSection from './sections/ReviewSection.js';

export default function LoanApplicationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Solicitud de Crédito</h1>
        <p className="mt-2 text-gray-600">
          Complete el formulario para iniciar su solicitud de crédito
        </p>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Información Personal */}
        <PersonalInfoSection />
        
        {/* Sección 2: Detalles del Crédito */}
        <LoanDetailsSection />
        
        {/* Sección 3: Subida de Documentos */}
        <DocumentUploadSection />
        
        {/* Sección 4: Revisión y Envío */}
        <ReviewSection />
      </div>
    </div>
  );
}
