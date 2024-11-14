'use client';

import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TicketSelectionSkeleton = () => {
  return (
    <Card className='lg:sticky lg:top-24'>
      <CardContent className='space-y-6 p-6'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-8 w-32' />
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='flex items-center justify-between font-medium'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-5 w-24' />
            </div>
          </div>
        </div>

        <Skeleton className='h-10 w-full' />
      </CardContent>
    </Card>
  );
};
