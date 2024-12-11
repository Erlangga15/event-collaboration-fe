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

import type { TicketType } from '@/types/event';

type FormData = z.infer<typeof ticketsSchema>;

const ticketTypes: Array<{ value: TicketType; label: string }> = [
  { value: 'FREE', label: 'Free' },
  { value: 'PAID', label: 'Paid' }
];

export function TicketsForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(ticketsSchema),
    defaultValues: {
      tickets: state.tickets.tickets || [
        {
          name: '',
          type: 'FREE',
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

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.tickets) {
        const currentValue = {
          tickets: value.tickets.map((ticket) => ({
            ...ticket,
            price: ticket?.price ?? 0,
            quantity: ticket?.quantity ?? 0,
            type: ticket?.type ?? 'FREE',
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
              type: ticket?.type ?? 'FREE',
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

                {form.watch(`tickets.${index}.type`) === 'PAID' && (
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                              Rp
                            </span>
                            <Input
                              type='number'
                              className='pl-9'
                              {...field}
                              value={field.value === 0 ? '' : field.value}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ''
                                    ? 0
                                    : Number(e.target.value);
                                field.onChange(value);
                              }}
                              disabled={
                                form.watch(`tickets.${index}.type`) !== 'PAID'
                              }
                            />
                          </div>
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
                          {...field}
                          value={field.value === 0 ? '' : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === ''
                                ? 0
                                : Number(e.target.value);
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
          className='w-full'
          onClick={() =>
            append({
              name: '',
              type: 'FREE',
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
