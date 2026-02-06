'use client';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const INDICATOR_COLORS = {
  active: 'bg-amber-600',
  completed: 'bg-amber-600',
  line: 'bg-amber-600',
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const colors = INDICATOR_COLORS;

  return (
    <nav aria-label="Progress">
      {/* Desktop version */}
      <ol className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={`relative ${!isLast ? 'flex-1' : ''}`}>
              <div className="flex items-center">
                {/* Step circle */}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? `${colors.completed} border-transparent`
                      : isCurrent
                      ? `border-current ${colors.active} text-white`
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className={isCurrent ? 'text-white font-semibold' : 'text-gray-500'}>
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="ml-4 flex-1 h-0.5 bg-gray-200">
                    <div
                      className={`h-full ${colors.line} transition-all duration-300`}
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>

              {/* Step label */}
              <div className="mt-2">
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile version */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Paso {currentStep} de {steps.length}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors.active} text-white`}>
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.line} transition-all duration-300`}
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
