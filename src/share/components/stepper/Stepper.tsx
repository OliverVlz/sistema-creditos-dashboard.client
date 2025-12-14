import React from 'react';

export interface Step {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '', onStepClick }) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Vista móvil - Mostrar solo el paso activo con indicador */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center space-x-2 mb-3">
          {steps.map((step, index) => {
            const isCompleted = step.completed || index < currentStep;
            const isActive = step.active || index === currentStep;
            
            return (
              <div
                key={step.id}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${isActive ? 'w-8 bg-[#5966a0]' : 'w-2'}
                  ${isCompleted && !isActive ? 'bg-[#FF8546]' : ''}
                  ${!isCompleted && !isActive ? 'bg-gray-200' : ''}
                `}
              />
            );
          })}
        </div>
        
        {/* Información del paso actual */}
        {steps[currentStep] && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[#5966a0] text-white shadow-md"
              >
                <span>{steps[currentStep].id}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#5966a0]">
                  {steps[currentStep].title}
                </p>
                {steps[currentStep].description && (
                  <p className="text-xs text-gray-500">
                    {steps[currentStep].description}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Paso {currentStep + 1} de {steps.length}
            </p>
          </div>
        )}
      </div>

      {/* Vista desktop - Stepper horizontal completo */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.completed || index < currentStep;
          const isActive = step.active || index === currentStep;
          const isLast = index === steps.length - 1;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <React.Fragment key={step.id}>
              {/* Paso individual */}
              <div 
                className={`flex flex-col items-center flex-1 ${isClickable ? 'cursor-pointer' : ''}`}
                onClick={() => isClickable && onStepClick?.(index)}
              >
                {/* Círculo del paso */}
                <div
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-[#FF8546] text-white shadow-lg'
                      : isActive
                      ? 'bg-[#5966a0] text-white shadow-md ring-4 ring-[#5966a0]/20'
                      : 'bg-gray-200 text-gray-500'
                    }
                    ${isClickable ? 'hover:scale-110' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-4 sm:h-4"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Información del paso */}
                <div className="mt-1.5 sm:mt-2 text-center max-w-[80px] sm:max-w-[100px] lg:max-w-[120px]">
                  <p
                    className={`
                      text-[10px] sm:text-xs font-semibold transition-colors
                      ${isActive ? 'text-[#5966a0]' : isCompleted ? 'text-[#FF8546]' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="hidden lg:block text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Línea conectora */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-[#FF8546]' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

