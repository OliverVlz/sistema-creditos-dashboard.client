import { useAppDispatch, useAppSelector, RootState } from '@/store';
import { Stepper } from '@/share/components/stepper';
import { LoanCalculator } from '../components/LoanCalculator';
import { ClientInformationComponent } from '../components/clientInformation';
import { UploadDocumentsComponent } from '../components/uploadDocuments';
import { CreditSummaryComponent } from '../components/creditSummary';
import { CreditStep } from '../models/creditStepsModel';
import { setCurrentStep } from '../slices/creditManagement';

export default function CreditManagementComponent() {
  const dispatch = useAppDispatch();
  const { currentStep } = useAppSelector((state: RootState) => state.creditManagement);

  // Configuración de los pasos
  const steps = [
    {
      id: 1,
      title: 'Calcular Crédito',
      description: 'Define el monto y plazo',
    },
    {
      id: 2,
      title: 'Información',
      description: 'Verifica tus datos',
    },
    {
      id: 3,
      title: 'Documentos',
      description: 'Adjunta los archivos',
    },
    {
      id: 4,
      title: 'Resumen',
      description: 'Revisa y envía',
    },
  ];

  // Renderizar el componente del paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case CreditStep.CALCULATE:
        return <LoanCalculator />;
      case CreditStep.CLIENT_INFO:
        return <ClientInformationComponent />;
      case CreditStep.UPLOAD_DOCS:
        return <UploadDocumentsComponent />;
      case CreditStep.SUMMARY:
        return <CreditSummaryComponent />;
      default:
        return <LoanCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stepper */}
        <div className="mb-4 sm:mb-6 lg:mb-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-200">
          <Stepper 
            steps={steps.map((step, index) => ({
              ...step,
              completed: index < currentStep,
              active: index === currentStep,
            }))}
            currentStep={currentStep}
            onStepClick={(stepIndex) => {
              // Permitir volver a pasos anteriores
              if (stepIndex <= currentStep) {
                dispatch(setCurrentStep(stepIndex));
              }
            }}
          />
        </div>

        {/* Contenido del paso actual */}
        <div className="animate-fade-in">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}