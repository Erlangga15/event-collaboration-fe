'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { promotionsSchema } from '@/lib/validations/event-schema';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
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
        type: 'FIXED',
        amount: 0,
        maxUses: 1,
        startDate: new Date(),
        endDate: new Date()
      }
    }
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.promotion) {
        const currentValue = {
          promotion: {
            ...value.promotion,
            amount: value.promotion?.amount ?? 0,
            maxUses: value.promotion?.maxUses ?? 1,
            startDate: value.promotion?.startDate ?? new Date(),
            endDate: value.promotion?.endDate ?? new Date()
          }
        };
        const currentState = {
          promotion: state.promotions.promotion
            ? {
                ...state.promotions.promotion,
                amount: state.promotions.promotion?.amount ?? 0,
                maxUses: state.promotions.promotion?.maxUses ?? 1,
                startDate: state.promotions.promotion?.startDate ?? new Date(),
                endDate: state.promotions.promotion?.endDate ?? new Date()
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
                      <SelectItem value='PERCENTAGE'>Percentage (%)</SelectItem>
                      <SelectItem value='FIXED'>Fixed Amount (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='promotion.amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('promotion.type') === 'PERCENTAGE'
                      ? 'Discount Percentage'
                      : 'Discount Amount'}
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      {form.watch('promotion.type') === 'FIXED' && (
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                          Rp
                        </span>
                      )}
                      <Input
                        type='number'
                        className={
                          form.watch('promotion.type') === 'FIXED' ? 'pl-9' : ''
                        }
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                      {form.watch('promotion.type') === 'PERCENTAGE' && (
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

            <FormField
              control={form.control}
              name='promotion.startDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto size-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date('2100-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='promotion.endDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto size-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < form.getValues('promotion.startDate') ||
                          date > new Date('2100-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
