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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface RegisterStep2Props {
  form: UseFormReturn<RegisterFormType>;
}

export const RegisterStep2 = ({ form }: RegisterStep2Props) => {
  return (
    <>
      <FormField
        control={form.control}
        name='step2.phone'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                placeholder='Enter your phone number'
                type='tel'
                inputMode='numeric'
                autoComplete='tel'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='step2.role'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select your account type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='CUSTOMER'>Event Attendee</SelectItem>
                <SelectItem value='ORGANIZER'>Event Organizer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
