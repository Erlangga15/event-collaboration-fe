'use client';

import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
      <div className='layout flex max-w-5xl flex-col items-center gap-4 text-center'>
        <Link
          href='#'
          className='rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium'
        >
          🎉 Launching Soon
        </Link>
        <h1 className='font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl'>
          Your Next{' '}
          <span className='text-primary-500'>Event Management Platform</span>
        </h1>
        <p className='max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
          Create, manage, and discover events with ease. Join our platform to
          connect with event organizers and attendees.
        </p>
        <div className='space-x-4'>
          <Button
            size='lg'
            className='bg-primary-500 text-white hover:bg-primary-600'
          >
            Get Started
          </Button>
          <Button size='lg' variant='outline'>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
