'use client';

import Image from 'next/image';
import * as React from 'react';

import { formatToIDDate, formatToIDR } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';

import type { Event } from '@/types/event';

interface EventHeaderProps {
  event: Event;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  const lowestPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((ticket) => ticket.price))
      : null;

  return (
    <section className='relative'>
      <div className='relative min-h-[500px] w-full overflow-hidden bg-black/60'>
        <Image
          src={
            event.image ??
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
          }
          alt={event.name}
          fill
          className='object-cover opacity-60'
          priority
          sizes='100vw'
        />
        <div className='layout relative flex min-h-[500px] items-end pb-12'>
          <div className='w-full space-y-6'>
            <div className='space-y-4'>
              <div className='inline-flex items-center rounded-full bg-primary-500 px-3 py-1 text-sm font-medium text-white'>
                {event.category}
              </div>
              <h1 className='font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:max-w-3xl'>
                {event.name}
              </h1>
            </div>

            <div className='flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:gap-8'>
              <div className='flex items-center gap-2'>
                <Icons.calendar className='size-5' />
                <span className='text-lg'>
                  {formatToIDDate(event.startDate)}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Icons.mapPin className='size-5' />
                <span className='text-lg'>{event.venueName}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Icons.ticket className='size-5' />
                <span className='text-lg font-medium'>
                  {event.tickets.length === 0
                    ? 'Tickets Unavailable'
                    : lowestPrice === 0
                      ? 'Free'
                      : formatToIDR(lowestPrice!)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
