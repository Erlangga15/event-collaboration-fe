'use client';

import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export const EventHeaderSkeleton = () => {
  return (
    <section className='relative'>
      <div className='relative min-h-[500px] w-full overflow-hidden bg-black/10'>
        <Skeleton className='size-full' />
        <div className='layout relative flex min-h-[500px] items-end pb-12'>
          <div className='w-full space-y-6'>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-12 w-full max-w-2xl sm:h-14 md:h-16' />
            </div>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8'>
              <Skeleton className='h-8 w-32' />
              <Skeleton className='h-8 w-40' />
              <Skeleton className='h-8 w-24' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
