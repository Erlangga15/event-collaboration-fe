'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { cn, formatPrice } from '@/lib/utils';

import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';
import { Icons } from '@/components/shared/Icons';
import { Card, CardContent } from '@/components/ui/card';

import { UPCOMING_EVENTS } from '@/constant/data/events';
import type { Event } from '@/constant/types/event';

interface EventGridProps {
  className?: string;
  events?: Event[];
  isLoading?: boolean;
  showLoadMore?: boolean;
}

export const EventGrid = ({
  className,
  events: propEvents,
  isLoading = false,
  showLoadMore = false
}: EventGridProps) => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [localLoading, setLocalLoading] = React.useState(true);

  const loadMore = React.useCallback(() => {
    setLocalLoading(true);
    // Simulate API call
    setTimeout(() => {
      const currentLength = events.length;
      const nextEvents = UPCOMING_EVENTS.slice(
        currentLength,
        currentLength + 6
      );

      setEvents((prev) => [...prev, ...nextEvents]);
      setLocalLoading(false);
    }, 800);
  }, [events.length]);

  React.useEffect(() => {
    if (!propEvents) {
      loadMore();
    }
  }, [loadMore, propEvents]);

  const displayEvents = propEvents || events;
  const loading = isLoading || localLoading;

  return (
    <div className={cn('space-y-8', className)}>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {loading && displayEvents.length === 0
          ? Array.from({ length: 8 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          : displayEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className='group relative h-full transition-all hover:shadow-lg'>
                  <div className='ribbon-container'>
                    <div className='relative aspect-[4/3]'>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className='rounded-t-lg object-cover'
                      />
                      <div className='ribbon-right flex items-center justify-center rounded-md rounded-tr-none'>
                        <span className='text-sm font-medium text-white'>
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className='relative space-y-3 p-4'>
                    <h3 className='line-clamp-1 pt-2 text-base font-semibold leading-tight group-hover:text-primary-500'>
                      {event.title}
                    </h3>
                    <div className='space-y-2 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <Icons.calendar className='size-4 shrink-0' />
                        <span className='line-clamp-1'>{event.date}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Icons.mapPin className='size-4 shrink-0' />
                        <span className='line-clamp-1'>{event.location}</span>
                      </div>
                    </div>
                    <div className='border-t pt-3'>
                      <span className='font-bold text-primary-500'>
                        {event.price === 0
                          ? 'Gratis'
                          : formatPrice(event.price)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};
