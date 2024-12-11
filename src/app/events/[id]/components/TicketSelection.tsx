'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { formatToIDR } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

import type { Event } from '@/types/event';

const ticketSchema = z.object({
  ticketId: z.string().min(1, 'Please select a ticket'),
  quantity: z.number().min(1, 'Minimum 1 ticket').max(10, 'Maximum 10 tickets')
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketSelectionProps {
  event: Event;
}

export const TicketSelection = ({ event }: TicketSelectionProps) => {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      quantity: 1
    }
  });

  const selectedTicketId = form.watch('ticketId');
  const quantity = form.watch('quantity');

  const selectedTicket = event.tickets.find(
    (ticket) => ticket.id === selectedTicketId
  );
  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  // eslint-disable-next-line unused-imports/no-unused-vars
  const onSubmit = (data: TicketFormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <Card>
      <CardContent className='space-y-6 p-6'>
        <div className='space-y-2'>
          <h3 className='font-medium'>Select Tickets</h3>
          <p className='text-sm text-muted-foreground'>
            {event.tickets.length} ticket types available
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='ticketId'
              render={({ field }) => (
                <FormItem>
                  <Label>Ticket Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a ticket type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {event.tickets.map((ticket) => (
                        <SelectItem key={ticket.id} value={ticket.id}>
                          {ticket.name} -{' '}
                          {ticket.price === 0
                            ? 'Free'
                            : formatToIDR(ticket.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <Label>Quantity</Label>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          form.setValue(
                            'quantity',
                            Math.max(1, field.value - 1)
                          )
                        }
                        disabled={field.value <= 1}
                      >
                        <Icons.minus className='size-4' />
                      </Button>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className='w-20 text-center'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          form.setValue(
                            'quantity',
                            Math.min(10, field.value + 1)
                          )
                        }
                        disabled={field.value >= 10}
                      >
                        <Icons.plus className='size-4' />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>{formatToIDR(subtotal)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Service Fee</span>
                <span>{formatToIDR(serviceFee)}</span>
              </div>
              <div className='flex justify-between border-t pt-2 font-medium'>
                <span>Total</span>
                <span>{formatToIDR(total)}</span>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-primary-500 text-white hover:bg-primary-600'
              disabled={!selectedTicketId}
            >
              Get Tickets
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
