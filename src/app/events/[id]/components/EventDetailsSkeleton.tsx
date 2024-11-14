'use client';

import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EventDetailsSkeleton = () => {
  return (
    <Card>
      <Tabs defaultValue='about' className='w-full'>
        <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
          <TabsTrigger
            value='about'
            className='rounded-none border-b-2 border-primary-500 px-4 py-3 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent'
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value='schedule'
            className='rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent'
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value='organizer'
            className='rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent'
          >
            Organizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value='about' className='space-y-4 p-6'>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </TabsContent>
        <TabsContent value='schedule' className='space-y-6 p-6'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-5 w-48' />
              <Skeleton className='h-4 w-full' />
            </div>
          ))}
        </TabsContent>
        <TabsContent value='organizer' className='p-6'>
          <div className='flex gap-4'>
            <Skeleton className='size-16 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-6 w-32' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
