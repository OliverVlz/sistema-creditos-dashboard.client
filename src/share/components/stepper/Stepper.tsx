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
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.completed || index < currentStep;
          const isActive = step.active || index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Paso individual */}
              <div className="flex flex-col items-center flex-1">
                {/* Círculo del paso */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-green-500 text-white shadow-lg'
                      : isActive
                      ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Información del paso */}
                <div className="mt-2 text-center max-w-[120px]">
                  <p
                    className={`
                      text-xs font-semibold transition-colors
                      ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Línea conectora */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
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

