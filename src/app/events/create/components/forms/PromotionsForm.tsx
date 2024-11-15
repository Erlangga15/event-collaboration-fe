'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { promotionsSchema } from '@/lib/validations/event-schema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useEventForm } from '../../context/EventFormContext';

type FormData = z.infer<typeof promotionsSchema>;

export function PromotionsForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(promotionsSchema),
    defaultValues: {
      promotions: state.promotions.promotions || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'promotions',
    control: form.control
  });

  // Watch form values and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.promotions) {
        const currentValue = {
          promotions: value.promotions.map((promo) => ({
            ...promo,
            code: promo?.code ?? '',
            discount: promo?.discount ?? 0,
            maxUses: promo?.maxUses ?? 0
          }))
        };
        const currentState = {
          promotions:
            state.promotions.promotions?.map((promo) => ({
              ...promo,
              code: promo?.code ?? '',
              discount: promo?.discount ?? 0,
              maxUses: promo?.maxUses ?? 0
            })) || []
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
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex flex-col gap-4 rounded-lg border p-4'
            >
              <div className='flex items-center justify-between'>
                <Label className='text-base'>Promotion {index + 1}</Label>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-destructive'
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`promotions.${index}.code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter promo code' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`promotions.${index}.discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter discount percentage'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`promotions.${index}.maxUses`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Uses</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter maximum uses'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-2'
          onClick={() =>
            append({
              code: '',
              discount: 0,
              maxUses: 1
            })
          }
        >
          Add Promotion
        </Button>
      </form>
    </Form>
  );
}
