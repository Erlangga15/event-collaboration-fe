'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn, formatToIDDate, formatToIDR } from '@/lib/utils';

import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';
import { Icons } from '@/components/shared/Icons';
import { Card, CardContent } from '@/components/ui/card';

import type { Event } from '@/types/event';

interface EventGridProps {
  className?: string;
  events: Event[];
  isLoading?: boolean;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const eventImage =
    event.image ??
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
  const formattedDate = formatToIDDate(event.startDate);

  const lowestPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((ticket) => ticket.price))
      : null;

  return (
    <Link href={`/events/${event.id}`}>
      <Card className='group relative h-full transition-all hover:shadow-lg'>
        <div className='ribbon-container'>
          <div className='relative aspect-[4/3]'>
            <Image
              src={eventImage}
              alt={event.name}
              fill
              className='rounded-t-lg object-cover'
              sizes='(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw'
              priority={false}
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
            {event.name}
          </h3>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <Icons.calendar className='size-4 shrink-0' />
              <span className='line-clamp-1'>{formattedDate}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icons.mapPin className='size-4 shrink-0' />
              <span className='line-clamp-1'>{event.venueName}</span>
            </div>
          </div>
          <div className='border-t pt-3'>
            <span className='font-bold text-primary-500'>
              {event.tickets.length === 0 ? (
                'Tickets Unavailable'
              ) : lowestPrice === 0 ? (
                'Free'
              ) : (
                <>
                  Start from{' '}
                  <span className='font-bold'>{formatToIDR(lowestPrice!)}</span>
                </>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const INITIAL_SKELETON_COUNT = 8;

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-6 rounded-full bg-primary-50 p-4'>
        <Icons.search className='size-8 text-primary-500' />
      </div>
      <h3 className='mb-2 font-heading text-xl font-semibold'>
        No Events Found
      </h3>
      <p className='max-w-[420px] text-muted-foreground'>
        We couldn't find any events matching your search criteria. Try adjusting
        your filters or search with different keywords.
      </p>
    </div>
  );
};

export const EventGrid = ({
  className,
  events,
  isLoading = false
}: EventGridProps) => {
  if (isLoading && events.length === 0) {
    return (
      <div className={cn('space-y-8', className)}>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, index) => (
            <EventCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn('space-y-8', className)}>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {events.map((event, index) => (
          <EventCard key={`event-${event.id}-${index}`} event={event} />
        ))}
      </div>
    </div>
  );
};
