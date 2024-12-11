'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LoginFormType, loginSchema } from '@/lib/validations/auth-schema';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { Icons } from '@/components/shared/Icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { type ApiErrorResponse } from '@/types/auth';

interface FormError {
  field?: keyof LoginFormType;
  message: string;
}

export const LoginForm = () => {
  const { login, isLoading } = useAuthContext();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const handleError = useCallback((error: unknown): FormError => {
    if (error instanceof Error) {
      if (
        error.cause &&
        typeof error.cause === 'object' &&
        'response' in error.cause
      ) {
        const apiError = error.cause as ApiErrorResponse;
        if (apiError.response?.data?.message) {
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
      message: 'Invalid email or password'
    };
  }, []);

  const onSubmit = useCallback(
    async (data: LoginFormType) => {
      try {
        await login(data);
        toast.success('Login successful');
      } catch (error) {
        const formError = handleError(error);
        toast.error('Authentication Failed', {
          description: formError.message,
          duration: 3000
        });
        form.setError('root', {
          message: formError.message
        });
      }
    },
    [form, handleError, login]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  autoComplete='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Remember me</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full bg-primary-500 text-white hover:bg-primary-600'
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className='mr-2 size-4 animate-spin' />}
          Sign In
        </Button>
      </form>
    </Form>
  );
};
