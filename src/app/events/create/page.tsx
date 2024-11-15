'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { eventFormSchema } from '@/lib/validations/event-schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Steps } from '@/components/ui/steps';

import { BasicDetailsForm } from './components/forms/BasicDetailsForm';
import { DateLocationForm } from './components/forms/DateLocationForm';
import { PromotionsForm } from './components/forms/PromotionsForm';
import { SummaryForm } from './components/forms/SummaryForm';
import { TicketsForm } from './components/forms/TicketsForm';
import { EventFormProvider, useEventForm } from './context/EventFormContext';

const steps = [
  { title: 'Basic Details', description: 'Event information and media' },
  { title: 'Date & Location', description: 'When and where' },
  { title: 'Tickets & Capacity', description: 'Pricing and availability' },
  { title: 'Promotions', description: 'Discounts and special offers' },
  { title: 'Summary', description: 'Review and publish' }
] as const satisfies readonly { title: string; description: string }[];

function CreateEventPageContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const { state } = useEventForm();

  const validateForms = () => {
    try {
      // Validate entire form state at once using the complete schema
      const validatedData = eventFormSchema.parse(state);

      // If validation passes, you can use the validated data for submission
      console.log('Validated form data:', validatedData);

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Group errors by form section for better error messages
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.join('.');
          return `${path}: ${issue.message}`;
        });

        toast.error('Please fix the following errors:', {
          description: errorMessages.join('\n')
        });
      } else {
        toast.error('An unexpected error occurred');
      }
      return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicDetailsForm />;
      case 1:
        return <DateLocationForm />;
      case 2:
        return <TicketsForm />;
      case 3:
        return <PromotionsForm />;
      case 4:
        return <SummaryForm />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // On last step, validate all forms before submission
      if (validateForms()) {
        // TODO: Handle event creation
        toast.success('Event created successfully!');
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Create <span className='text-primary-500'>New Event</span>
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            Fill in the details below to create your event
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Left Column - Steps */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-24 bg-white p-6 shadow-sm'>
              <Steps
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => {
                  setCurrentStep(step);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Card>
          </div>

          {/* Right Column - Form Content */}
          <div className='lg:col-span-3'>
            <Card className='mb-6 bg-white p-8 shadow-sm'>
              {renderStepContent()}
            </Card>

            {/* Navigation Buttons */}
            <div className='flex items-center justify-between'>
              <Button
                variant='outline'
                onClick={handleBack}
                disabled={currentStep === 0}
                className='min-w-[120px]'
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className='min-w-[120px] bg-primary-500 text-white hover:bg-primary-600'
              >
                {currentStep === steps.length - 1 ? 'Create Event' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <EventFormProvider>
      <CreateEventPageContent />
    </EventFormProvider>
  );
}
