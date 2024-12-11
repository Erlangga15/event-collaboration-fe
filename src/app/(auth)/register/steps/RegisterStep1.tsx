'use client';

import { UseFormReturn } from 'react-hook-form';

import { RegisterFormType } from '@/lib/validations/auth-schema';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface RegisterStep1Props {
  form: UseFormReturn<RegisterFormType>;
}

export const RegisterStep1 = ({ form }: RegisterStep1Props) => {
  return (
    <>
      <FormField
        control={form.control}
        name='step1.fullName'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder='John Doe' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='step1.email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder='name@example.com'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='step1.password'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                placeholder='Enter your password'
                type='password'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='step1.confirmPassword'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                placeholder='Confirm your password'
                type='password'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
