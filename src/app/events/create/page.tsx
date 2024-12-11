'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { formatToUTCString } from '@/lib/utils';
import { eventFormSchema } from '@/lib/validations/event-schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Steps } from '@/components/ui/steps';

import type { CreateEventRequest } from '@/services/event';
import eventApi from '@/services/event';

import { BasicDetailsForm } from './components/forms/BasicDetailsForm';
import { DateLocationForm } from './components/forms/DateLocationForm';
import { PromotionsForm } from './components/forms/PromotionsForm';
import { SummaryForm } from './components/forms/SummaryForm';
import { TicketsForm } from './components/forms/TicketsForm';
import { EventFormProvider, useEventForm } from './context/EventFormContext';

import type { EventCategory, TicketType } from '@/types/event';

const steps = [
  { title: 'Basic Details', description: 'Event information and media' },
  { title: 'Date & Location', description: 'When and where' },
  { title: 'Tickets & Capacity', description: 'Pricing and availability' },
  { title: 'Promotions', description: 'Discounts and special offers' },
  { title: 'Summary', description: 'Review and publish' }
] as const satisfies readonly { title: string; description: string }[];

function CreateEventPageContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state } = useEventForm();
  const router = useRouter();

  const validateForms = () => {
    try {
      eventFormSchema.parse(state);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => {
          let fieldName = issue.path.join('.');
          fieldName = fieldName
            .replace('basicDetails.title', 'Title')
            .replace('basicDetails.description', 'Description')
            .replace('basicDetails.imageUrl', 'Image')
            .replace('dateLocation.startDate', 'Start Date')
            .replace('dateLocation.endDate', 'End Date')
            .replace('dateLocation.venue', 'Venue')
            .replace('dateLocation.address', 'Address');

          return `${fieldName}: ${issue.message}`;
        });

        toast.error('Please fix the following errors:', {
          duration: 5000,
          position: 'top-center',
          description: (
            <ul className='mt-2 list-disc pl-4 text-sm'>
              {errorMessages.map((msg, idx) => (
                <li key={idx} className='text-red-600'>
                  {msg}
                </li>
              ))}
            </ul>
          )
        });
      } else {
        toast.error('Error validation', {
          duration: 3000,
          position: 'top-center'
        });
      }
      return false;
    }
  };

  const transformTicketData = (tickets: typeof state.tickets.tickets) => {
    if (!tickets) return [];

    return tickets.map((ticket) => ({
      name: ticket.name,
      price: ticket.type === 'PAID' ? ticket.price || 0 : 0,
      quantity: ticket.quantity,
      type: ticket.type as TicketType
    }));
  };

  const transformPromotionData = (
    promotion: typeof state.promotions.promotion
  ) => {
    if (!promotion) return undefined;

    return {
      code: promotion.code,
      type: promotion.type,
      amount: promotion.amount,
      maxUses: promotion.maxUses,
      startDate: promotion.startDate.toISOString(),
      endDate: promotion.endDate.toISOString()
    };
  };

  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Creating event...');

      try {
        if (!validateForms()) {
          toast.dismiss(loadingToast);
          return;
        }

        if (
          !state.basicDetails.title?.trim() ||
          !state.basicDetails.description?.trim() ||
          !state.basicDetails.category
        ) {
          toast.dismiss(loadingToast);
          toast.error('Basic details are required');
          return;
        }

        if (
          !state.dateLocation.startDate ||
          !state.dateLocation.endDate ||
          !state.dateLocation.startTime ||
          !state.dateLocation.endTime ||
          !state.dateLocation.venue?.trim() ||
          !state.dateLocation.address?.trim()
        ) {
          toast.dismiss(loadingToast);
          toast.error('Please fill in all date and location details');
          return;
        }

        if (!state.tickets.tickets?.length) {
          toast.dismiss(loadingToast);
          toast.error('Please add at least one ticket');
          return;
        }

        const startDateTime = new Date(state.dateLocation.startDate);
        const endDateTime = new Date(state.dateLocation.endDate);

        if (state.dateLocation.startTime) {
          const [hours, minutes] = state.dateLocation.startTime.split(':');
          startDateTime.setHours(Number(hours), Number(minutes), 0, 0);
        }

        if (state.dateLocation.endTime) {
          const [hours, minutes] = state.dateLocation.endTime.split(':');
          endDateTime.setHours(Number(hours), Number(minutes), 0, 0);
        }

        if (startDateTime >= endDateTime) {
          toast.dismiss(loadingToast);
          toast.error('End date must be after start date');
          return;
        }

        const eventData: CreateEventRequest = {
          name: state.basicDetails.title.trim(),
          description: state.basicDetails.description.trim(),
          startDate: formatToUTCString(startDateTime),
          endDate: formatToUTCString(endDateTime),
          venueName: state.dateLocation.venue.trim(),
          venueAddress: state.dateLocation.address.trim(),
          category: state.basicDetails.category as EventCategory,
          status: 'PUBLISHED',
          tickets: transformTicketData(state.tickets.tickets),
          ...(state.basicDetails.imageUrl && {
            image: state.basicDetails.imageUrl
          }),
          ...(state.promotions.promotion && {
            promotion: transformPromotionData(state.promotions.promotion)
          })
        };

        try {
          const createdEvent = await eventApi.createEvent(eventData);

          toast.dismiss(loadingToast);
          toast.success('Event created successfully!', {
            duration: 3000,
            position: 'top-center'
          });

          router.push(`/events/${createdEvent.id}`);
        } catch (error) {
          toast.dismiss(loadingToast);

          if (error instanceof Error) {
            toast.error(`Failed to create event: ${error.message}`, {
              duration: 5000,
              position: 'top-center'
            });
          } else if (
            error &&
            typeof error === 'object' &&
            'response' in error
          ) {
            const axiosError = error as {
              response?: { data?: { message?: string } };
            };
            toast.error(
              `Error server: ${axiosError.response?.data?.message || 'Unknown error'}`,
              {
                duration: 5000,
                position: 'top-center'
              }
            );
          } else {
            toast.error('Failed to create event. Please try again.', {
              duration: 5000,
              position: 'top-center'
            });
          }
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('An unexpected error occurred', {
          duration: 5000,
          position: 'top-center'
        });
      }
    } finally {
      setIsSubmitting(false);
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

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      try {
        if (validateForms()) {
          await handleCreateEvent();
        } else {
          toast.error('Please fill in all required fields');
        }
      } catch (error) {
        toast.error('Failed to process form submission');
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

          <div className='lg:col-span-3'>
            <Card className='mb-6 bg-white p-8 shadow-sm'>
              {renderStepContent()}
            </Card>

            <div className='flex items-center justify-between'>
              <Button
                variant='outline'
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className='min-w-[120px]'
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className='min-w-[120px] bg-primary-500 text-white hover:bg-primary-600'
              >
                {isSubmitting
                  ? 'Creating...'
                  : currentStep === steps.length - 1
                    ? 'Create Event'
                    : 'Next'}
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
