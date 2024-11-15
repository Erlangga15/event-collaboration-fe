'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { dateLocationSchema } from '@/lib/validations/event-schema';

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

import { useEventForm } from '../../context/EventFormContext';

type FormData = z.infer<typeof dateLocationSchema>;

export function DateLocationForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(dateLocationSchema),
    defaultValues: {
      startDate: state.dateLocation.startDate
        ? new Date(state.dateLocation.startDate)
        : new Date(),
      endDate: state.dateLocation.endDate
        ? new Date(state.dateLocation.endDate)
        : new Date(),
      startTime: state.dateLocation.startTime ?? '',
      endTime: state.dateLocation.endTime ?? '',
      venue: state.dateLocation.venue ?? '',
      address: state.dateLocation.address ?? '',
      city: state.dateLocation.city ?? '',
      country: state.dateLocation.country ?? ''
    }
  });

  // Watch form values and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        const currentValue = {
          ...value,
          startDate: value.startDate ? new Date(value.startDate) : new Date(),
          endDate: value.endDate ? new Date(value.endDate) : new Date()
        };
        const currentState = {
          ...state.dateLocation,
          startDate: state.dateLocation.startDate
            ? new Date(state.dateLocation.startDate)
            : new Date(),
          endDate: state.dateLocation.endDate
            ? new Date(state.dateLocation.endDate)
            : new Date()
        };

        if (JSON.stringify(currentValue) !== JSON.stringify(currentState)) {
          dispatch({
            type: 'UPDATE_DATE_LOCATION',
            payload: value as FormData
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, form, state.dateLocation]);

  return (
    <Form {...form}>
      <form className='space-y-6'>
        <div className='grid gap-6 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='startDate'
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
            name='endDate'
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
                        date < form.getValues('startDate') ||
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

        <div className='grid gap-6 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='startTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='venue'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter venue name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='Enter venue address' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder='Enter city' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder='Enter country' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
