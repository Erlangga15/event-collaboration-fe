'use client';

import { notFound } from 'next/navigation';
import * as React from 'react';

import { UPCOMING_EVENTS } from '@/constant/data/events';
import type { Event } from '@/constant/types/event';

import { EventDetails } from './components/EventDetails';
import { EventDetailsSkeleton } from './components/EventDetailsSkeleton';
import { EventHeader } from './components/EventHeader';
import { EventHeaderSkeleton } from './components/EventHeaderSkeleton';
import { ReviewSection } from './components/ReviewSection';
import { TicketSelection } from './components/TicketSelection';
import { TicketSelectionSkeleton } from './components/TicketSelectionSkeleton';

interface EventPageProps {
  params: {
    id: string;
  };
}

// Separate the event fetching logic
const fetchEvent = (id: string): Promise<Event | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundEvent = UPCOMING_EVENTS.find((e) => e.id === id);
      resolve(foundEvent || null);
    }, 500);
  });
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
        <div className='space-y-8 lg:col-span-2'>
          <EventDetails event={event} />
          <ReviewSection eventId={event.id} />
        </div>
        <div>
          <TicketSelection event={event} />
        </div>
      </div>
    </main>
  );
}
