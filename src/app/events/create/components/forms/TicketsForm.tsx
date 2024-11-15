'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { ticketsSchema } from '@/lib/validations/event-schema';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { useEventForm } from '../../context/EventFormContext';

type FormData = z.infer<typeof ticketsSchema>;

const ticketTypes = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'donation', label: 'Donation' }
] as const;

export function TicketsForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(ticketsSchema),
    defaultValues: {
      tickets: state.tickets.tickets || [
        {
          name: '',
          type: 'free',
          price: 0,
          quantity: 0,
          description: ''
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'tickets',
    control: form.control
  });

  // Watch form values and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.tickets) {
        const currentValue = {
          tickets: value.tickets.map((ticket) => ({
            ...ticket,
            price: ticket?.price ?? 0,
            quantity: ticket?.quantity ?? 0,
            type: ticket?.type ?? 'free',
            name: ticket?.name ?? '',
            description: ticket?.description ?? ''
          }))
        };
        const currentState = {
          tickets:
            state.tickets.tickets?.map((ticket) => ({
              ...ticket,
              price: ticket?.price ?? 0,
              quantity: ticket?.quantity ?? 0,
              type: ticket?.type ?? 'free',
              name: ticket?.name ?? '',
              description: ticket?.description ?? ''
            })) || []
        };

        if (JSON.stringify(currentValue) !== JSON.stringify(currentState)) {
          dispatch({
            type: 'UPDATE_TICKETS',
            payload: value as FormData
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, form, state.tickets]);

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
                <Label className='text-base'>Ticket {index + 1}</Label>
                {index > 0 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='text-destructive'
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`tickets.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter ticket name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select ticket type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ticketTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch(`tickets.${index}.type`) === 'paid' && (
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter ticket price'
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
                )}

                <FormField
                  control={form.control}
                  name={`tickets.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter ticket quantity'
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
                  name={`tickets.${index}.description`}
                  render={({ field }) => (
                    <FormItem className='col-span-full'>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter ticket description'
                          {...field}
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
              name: '',
              type: 'free',
              price: 0,
              quantity: 0,
              description: ''
            })
          }
        >
          Add Ticket
        </Button>
      </form>
    </Form>
  );
}
