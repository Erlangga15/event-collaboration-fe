'use client';

import { UseFormReturn } from 'react-hook-form';

import { RegisterFormType } from '@/lib/validations/auth-schema';

import { Icons } from '@/components/shared/Icons';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface RegisterStep3Props {
  form: UseFormReturn<RegisterFormType>;
}

export const RegisterStep3 = ({ form }: RegisterStep3Props) => {
  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-start space-x-4'>
            <div className='flex size-10 items-center justify-center rounded-full bg-primary-50'>
              <Icons.gift className='size-5 text-primary-500' />
            </div>
            <div className='space-y-1'>
              <h4 className='text-sm font-medium'>Referral Benefits</h4>
              <p className='text-sm text-muted-foreground'>
                Get 10,000 points when you sign up with a referral code. Points
                can be used for discounts on event tickets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormField
        control={form.control}
        name='step3.referralCode'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referral Code (Optional)</FormLabel>
            <FormControl>
              <Input placeholder='Enter referral code' {...field} />
            </FormControl>
            <FormDescription>
              Have a referral code? Enter it here to claim your points.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
