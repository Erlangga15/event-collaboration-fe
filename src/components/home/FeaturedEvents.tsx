'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import 'keen-slider/keen-slider.min.css';

import { formatPrice } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';
import { Card, CardContent } from '@/components/ui/card';

import { FEATURED_EVENTS } from '@/constant/data/events';

import { FeaturedEventsSkeleton } from './FeaturedEventsSkeleton';

export const FeaturedEvents = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2,
      spacing: 16
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2.2, spacing: 16 }
      },
      '(min-width: 1024px)': {
        slides: { perView: 3.2, spacing: 16 }
      }
    }
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FeaturedEventsSkeleton />;
  }

  return (
    <div ref={sliderRef} className='keen-slider overflow-visible'>
      {FEATURED_EVENTS.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className='keen-slider__slide !overflow-visible'
        >
          <Card className='group relative h-full transition-all hover:shadow-lg'>
            <div className='ribbon-container z-10'>
              <div className='relative aspect-video'>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className='rounded-t-lg object-cover'
                  sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
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
                  {event.price === 0 ? 'Gratis' : formatPrice(event.price)}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
