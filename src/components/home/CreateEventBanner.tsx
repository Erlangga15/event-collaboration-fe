'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export const CreateEventBanner = () => {
  return (
    <section className='relative'>
      <div className='layout grid min-h-[400px] grid-cols-1 lg:grid-cols-2'>
        <div className='flex items-center bg-primary-50 px-6 py-12 dark:bg-primary-950/50 lg:px-12'>
          <div className='mx-auto max-w-lg space-y-4 text-center lg:mx-0 lg:text-left'>
            <h2 className='font-heading text-2xl font-bold sm:text-3xl'>
              Ready to Host Your Own Event?
            </h2>
            <p className='text-muted-foreground'>
              Create and manage your events with our powerful platform. Start
              sharing your amazing experiences with the community today.
            </p>
            <Button
              size='lg'
              className='bg-primary-500 text-white hover:bg-primary-600'
              asChild
            >
              <Link href='/create-event'>Create Event</Link>
            </Button>
          </div>
        </div>

        <div className='relative flex min-h-[280px] items-center justify-center overflow-hidden bg-white px-6 py-8 dark:bg-background lg:min-h-[400px] lg:px-12'>
          <div className='relative h-[300px] w-[500px] lg:h-[350px] lg:w-[600px]'>
            <Image
              src='/images/create-event-banner.webp'
              alt='Create Event Illustration'
              fill
              className='object-contain'
              priority
              sizes='(min-width: 1024px) 600px, 500px'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
