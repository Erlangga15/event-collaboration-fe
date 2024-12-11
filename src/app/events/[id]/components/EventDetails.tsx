'use client';

import { Icons } from '@/components/shared/Icons';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { Event } from '@/types/event';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <div className='space-y-8'>
      {/* About Section */}
      <Card className='p-6'>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <h2 className='text-xl font-semibold'>About this event</h2>
          </div>
          <div
            className='prose prose-gray dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>
      </Card>

      {/* Organizer Section */}
      <Card className='p-6'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold'>Hosted by</h2>
              <p className='text-sm text-muted-foreground'>
                Learn more about the organizer
              </p>
            </div>
          </div>

          <Separator className='bg-gray-200' />

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-500'>
                <Icons.user className='size-6' />
              </div>
              <div>
                <h3 className='font-medium'>{event.organizer.fullName}</h3>
                <p className='text-sm text-muted-foreground'>Event Organizer</p>
              </div>
            </div>

            <div className='grid gap-4 rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-900'>
              <div className='flex items-center gap-3'>
                <Icons.mail className='size-4 text-primary-500' />
                <span>{event.organizer.email}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Icons.phone className='size-4 text-primary-500' />
                <span>{event.organizer.phone}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Icons.info className='size-4 text-primary-500' />
                <span>Status: {event.organizer.status}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
