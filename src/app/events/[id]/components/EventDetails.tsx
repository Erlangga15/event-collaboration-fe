'use client';

import Image from 'next/image';
import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EventDetailsProps {
  event: {
    description: string;
    organizer: {
      name: string;
      image: string;
      description: string;
    };
    schedule: Array<{
      time: string;
      title: string;
      description: string;
    }>;
  };
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <Card>
      <Tabs defaultValue='about' className='w-full'>
        <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
          <TabsTrigger
            value='about'
            className='rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent'
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
        <TabsContent value='about' className='p-6'>
          <div
            className='prose prose-gray dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </TabsContent>
        <TabsContent value='schedule' className='p-6'>
          <div className='space-y-6'>
            {event.schedule.map((item, index) => (
              <div key={index} className='flex gap-4'>
                <div className='w-24 shrink-0 font-medium'>{item.time}</div>
                <div className='space-y-1'>
                  <h3 className='font-medium'>{item.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='organizer' className='p-6'>
          <div className='flex items-center gap-4'>
            <Image
              src={event.organizer.image}
              alt={event.organizer.name}
              width={80}
              height={80}
              className='rounded-full'
            />
            <div>
              <h3 className='font-medium'>{event.organizer.name}</h3>
              <p className='text-sm text-muted-foreground'>
                {event.organizer.description}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
