'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';

import 'keen-slider/keen-slider.min.css';

import { formatToIDDate, formatToIDR } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';
import { Card, CardContent } from '@/components/ui/card';

import { FeaturedEventsSkeleton } from './FeaturedEventsSkeleton';

import { type Event } from '@/types/event';

const SLIDER_BREAKPOINTS = {
  default: { perView: 1.2, spacing: 16 },
  md: { perView: 2.2, spacing: 16 },
  lg: { perView: 3.2, spacing: 16 }
} as const;

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
    <Link
      href={`/events/${event.id}`}
      className='keen-slider__slide !overflow-visible'
    >
      <Card className='group relative h-full transition-all hover:shadow-lg'>
        <div className='ribbon-container z-10'>
          <div className='relative aspect-video'>
            <Image
              src={eventImage}
              alt={event.name}
              fill
              className='rounded-t-lg object-cover'
              sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
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
          <h3 className='line-clamp-1 pt-2 text-base font-semibold leading-tight transition-colors group-hover:text-primary-500'>
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

interface FeaturedEventsProps {
  events: Event[];
  isLoading?: boolean;
}

export const FeaturedEvents = ({
  events,
  isLoading = false
}: FeaturedEventsProps) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: SLIDER_BREAKPOINTS.default,
    breakpoints: {
      '(min-width: 768px)': { slides: SLIDER_BREAKPOINTS.md },
      '(min-width: 1024px)': { slides: SLIDER_BREAKPOINTS.lg }
    }
  });

  if (isLoading) return <FeaturedEventsSkeleton />;
  if (events.length === 0) return null;

  return (
    <div ref={sliderRef} className='keen-slider overflow-visible'>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
