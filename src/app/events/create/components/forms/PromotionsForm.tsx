'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { promotionsSchema } from '@/lib/validations/event-schema';

import {
  Form,
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

import { useEventForm } from '../../context/EventFormContext';

type FormData = z.infer<typeof promotionsSchema>;

export function PromotionsForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(promotionsSchema),
    defaultValues: {
      promotion: state.promotions.promotion || {
        code: '',
        type: 'percentage',
        value: 0,
        maxUses: 1
      }
    }
  });

  // Watch form values and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.promotion) {
        const currentValue = {
          promotion: {
            ...value.promotion,
            value: value.promotion?.value ?? 0,
            maxUses: value.promotion?.maxUses ?? 1
          }
        };
        const currentState = {
          promotion: state.promotions.promotion
            ? {
                ...state.promotions.promotion,
                value: state.promotions.promotion?.value ?? 0,
                maxUses: state.promotions.promotion?.maxUses ?? 1
              }
            : null
        };

        if (JSON.stringify(currentValue) !== JSON.stringify(currentState)) {
          dispatch({
            type: 'UPDATE_PROMOTIONS',
            payload: value as FormData
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, form, state.promotions]);

  return (
    <Form {...form}>
      <form className='space-y-6'>
        <div className='space-y-4 rounded-lg border p-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='promotion.code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='promotion.type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select discount type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='percentage'>Percentage (%)</SelectItem>
                      <SelectItem value='fixed'>Fixed Amount (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='promotion.value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('promotion.type') === 'percentage'
                      ? 'Discount Percentage'
                      : 'Discount Amount'}
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      {form.watch('promotion.type') === 'fixed' && (
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                          Rp
                        </span>
                      )}
                      <Input
                        type='number'
                        className={
                          form.watch('promotion.type') === 'fixed' ? 'pl-9' : ''
                        }
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                      {form.watch('promotion.type') === 'percentage' && (
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                          %
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='promotion.maxUses'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Uses</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === '' ? 0 : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
