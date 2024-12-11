'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import {
  RegisterFormType,
  registerSchema
} from '@/lib/validations/auth-schema';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { Icons } from '@/components/shared/Icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { RegisterStep1 } from './steps/RegisterStep1';
import { RegisterStep2 } from './steps/RegisterStep2';
import { RegisterStep3 } from './steps/RegisterStep3';

import { type ApiErrorResponse } from '@/types/auth';

interface Step {
  id: 1 | 2 | 3;
  title: string;
}

const STEPS: readonly Step[] = [
  { id: 1, title: 'Account Details' },
  { id: 2, title: 'Personal Info' },
  { id: 3, title: 'Referral Code' }
] as const;

interface FormFieldPaths {
  step1: `step1.${keyof RegisterFormType['step1']}`;
  step2: `step2.${keyof RegisterFormType['step2']}`;
  step3: `step3.${keyof RegisterFormType['step3']}`;
}

interface FormError {
  field?: FormFieldPaths[keyof FormFieldPaths];
  message: string;
}

export const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState<Step['id']>(1);
  const { register, isLoading } = useAuthContext();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      step1: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      step2: {
        phone: '',
        role: 'CUSTOMER'
      },
      step3: {
        referralCode: ''
      }
    },
    mode: 'onChange'
  });

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const currentData = form.getValues();
    try {
      if (currentStep === 1) {
        await z
          .object({ step1: registerSchema.shape.step1 })
          .parseAsync({ step1: currentData.step1 });
      } else if (currentStep === 2) {
        await z
          .object({ step2: registerSchema.shape.step2 })
          .parseAsync({ step2: currentData.step2 });
      }
      return true;
    } catch {
      return false;
    }
  }, [currentStep, form]);

  const handleNext = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep((prev) =>
          prev < STEPS.length ? ((prev + 1) as Step['id']) : prev
        );
      } else {
        await form.trigger(
          currentStep === 1
            ? [
                'step1.fullName',
                'step1.email',
                'step1.password',
                'step1.confirmPassword'
              ]
            : ['step2.phone', 'step2.role']
        );
      }
    },
    [currentStep, form, validateCurrentStep]
  );

  const handleError = useCallback((error: unknown): FormError => {
    if (error instanceof Error) {
      if (
        error.cause &&
        typeof error.cause === 'object' &&
        'response' in error.cause
      ) {
        const apiError = error.cause as ApiErrorResponse;
        if (apiError.response?.data?.message) {
          if (apiError.response.data.message.includes('Referral code')) {
            return {
              field: 'step3.referralCode',
              message: apiError.response.data.message
            };
          }
          return {
            message: apiError.response.data.message
          };
        }
      }
      return {
        message: error.message
      };
    }
    return {
      message: 'Registration failed. Please try again.'
    };
  }, []);

  const onSubmit = useCallback(
    async (data: RegisterFormType) => {
      const loadingToast = toast.loading('Creating your account...');
      try {
        await register(data);
        toast.dismiss(loadingToast);
        toast.success('Registration successful');
      } catch (error) {
        toast.dismiss(loadingToast);
        const formError = handleError(error);

        if (formError.field === 'step3.referralCode') {
          form.setError('step3.referralCode', {
            message: formError.message
          });
        } else {
          toast.error('Registration Failed', {
            description: formError.message,
            duration: 3000
          });
          form.setError('root', {
            message: formError.message
          });
        }
      }
    },
    [form, handleError, register]
  );

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          {STEPS.map((step) => (
            <div key={step.id} className='flex flex-col items-center'>
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 font-semibold',
                  currentStep >= step.id
                    ? 'border-primary-500 text-primary-500'
                    : 'border-muted text-muted'
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs',
                  currentStep >= step.id
                    ? 'text-primary-500'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {form.formState.errors.root && (
              <Alert variant='destructive'>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && <RegisterStep1 form={form} />}
            {currentStep === 2 && <RegisterStep2 form={form} />}
            {currentStep === 3 && <RegisterStep3 form={form} />}

            <div className='flex gap-2'>
              {currentStep > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setCurrentStep((prev) => (prev - 1) as Step['id'])
                  }
                  disabled={isLoading}
                  className='w-full bg-white'
                >
                  Previous
                </Button>
              )}
              {currentStep < STEPS.length ? (
                <Button
                  type='button'
                  onClick={handleNext}
                  disabled={isLoading}
                  className='w-full bg-primary-500 text-white hover:bg-primary-600'
                >
                  Next
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-primary-500 text-white hover:bg-primary-600'
                >
                  {isLoading && (
                    <Icons.spinner className='mr-2 size-4 animate-spin' />
                  )}
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
