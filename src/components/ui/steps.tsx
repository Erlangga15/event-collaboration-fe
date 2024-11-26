import { CheckCircle2, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Step {
  readonly title: string;
  readonly description: string;
}

interface StepsProps {
  steps: readonly Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className='flex flex-col gap-4'>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= currentStep;

        return (
          <div
            key={step.title}
            className={cn(
              'flex items-start gap-3 rounded-lg p-2 transition-colors',
              isClickable && 'cursor-pointer hover:bg-primary-50',
              isCurrent && 'bg-primary-50'
            )}
            onClick={() => isClickable && onStepClick?.(index)}
          >
            <div className='mt-0.5 shrink-0'>
              {isCompleted ? (
                <CheckCircle2 className='size-5 text-primary-500' />
              ) : (
                <Circle
                  className={cn(
                    'size-5',
                    isCurrent ? 'text-primary-500' : 'text-muted-foreground'
                  )}
                />
              )}
            </div>
            <div className='flex flex-col gap-0.5'>
              <div
                className={cn(
                  'text-sm font-medium',
                  isCurrent
                    ? 'text-primary-500'
                    : isCompleted
                      ? 'text-primary-700'
                      : 'text-muted-foreground'
                )}
              >
                {step.title}
              </div>
              <div
                className={cn(
                  'text-sm',
                  isCurrent
                    ? 'text-primary-500'
                    : isCompleted
                      ? 'text-primary-600'
                      : 'text-muted-foreground'
                )}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
