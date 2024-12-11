'use client';

import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const EventDetailsSkeleton = () => {
  return (
    <div className='space-y-8'>
      <Card className='p-6'>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-7 w-40' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
      </Card>

      <Card className='p-6'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <Skeleton className='h-7 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
          </div>

          <Separator className='bg-gray-200' />

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Skeleton className='size-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>

            <div className='grid gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900'>
              <div className='flex items-center gap-3'>
                <Skeleton className='size-4' />
                <Skeleton className='h-4 w-48' />
              </div>
              <div className='flex items-center gap-3'>
                <Skeleton className='size-4' />
                <Skeleton className='h-4 w-32' />
              </div>
              <div className='flex items-center gap-3'>
                <Skeleton className='size-4' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
