'use client';

import { notFound } from 'next/navigation';
import * as React from 'react';

import eventApi from '@/services/event';

import { EventDetails } from './components/EventDetails';
import { EventDetailsSkeleton } from './components/EventDetailsSkeleton';
import { EventHeader } from './components/EventHeader';
import { EventHeaderSkeleton } from './components/EventHeaderSkeleton';
import { TicketSelection } from './components/TicketSelection';
import { TicketSelectionSkeleton } from './components/TicketSelectionSkeleton';

import type { Event } from '@/types/event';

interface EventPageProps {
  params: {
    id: string;
  };
}

const fetchEvent = async (id: string): Promise<Event | null> => {
  try {
    const event = await eventApi.getEventById(id);
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export default function EventPage({ params }: Readonly<EventPageProps>) {
  const [event, setEvent] = React.useState<Event | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getEvent = async () => {
      const result = await fetchEvent(params.id);
      setEvent(result);
      setIsLoading(false);
    };

    getEvent();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className='min-h-[calc(100vh-4rem)]'>
        <EventHeaderSkeleton />
        <div className='layout grid gap-8 py-8 lg:grid-cols-3'>
          <div className='space-y-8 lg:col-span-2'>
            <EventDetailsSkeleton />
          </div>
          <div>
            <TicketSelectionSkeleton />
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    notFound();
  }

  return (
    <main className='min-h-[calc(100vh-4rem)]'>
      <EventHeader event={event} />
      <div className='layout grid gap-8 py-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <EventDetails event={event} />
        </div>
        <div className='lg:sticky lg:top-8'>
          <TicketSelection event={event} />
        </div>
      </div>
    </main>
  );
}
