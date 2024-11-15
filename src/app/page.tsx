'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { CategoryFilters } from '@/components/home/CategoryFilters';
import { CreateEventBanner } from '@/components/home/CreateEventBanner';
import { EventGrid } from '@/components/home/EventGrid';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className='relative min-h-[600px] space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/hero-bg.webp'
            alt='Hero background'
            fill
            className='object-cover brightness-[0.80]'
            priority
            sizes='100vw'
          />
        </div>
        <div className='layout relative z-10 flex max-w-5xl flex-col items-center gap-4 text-center'>
          <h1 className='font-heading text-3xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl'>
            Discover <span className='text-primary-700'>Amazing Events </span>{' '}
            Near You
          </h1>
          <p className='max-w-2xl text-lg text-gray-100 sm:text-xl'>
            Find and book tickets for concerts, festivals, workshops, and more.
            Your next unforgettable experience starts here.
          </p>
          <SearchBar className='w-full max-w-2xl' />
        </div>
      </section>

      {/* Category Filters */}
      <section className='layout py-12'>
        <CategoryFilters />
      </section>

      {/* Upcoming Events */}
      <section className='layout space-y-6 py-12'>
        <h2 className='font-heading text-2xl font-bold sm:text-3xl'>
          Upcoming <span className='text-primary-500'>Events</span>
        </h2>
        <EventGrid />
        <div className='flex justify-center'>
          <Button
            variant='secondary'
            asChild
            className='group border-primary-500 bg-primary-50 font-bold text-primary-500 hover:bg-primary-100'
          >
            <Link href='/events' className='flex items-center gap-2'>
              View all events
            </Link>
          </Button>
        </div>
      </section>

      {/* Create Event Banner */}
      <CreateEventBanner />

      {/* Featured Events */}
      <section className='layout space-y-6 py-12'>
        <h2 className='font-heading text-2xl font-bold sm:text-3xl'>
          Featured <span className='text-primary-500'>Events</span>
        </h2>
        <FeaturedEvents />
        <div className='flex justify-center'>
          <Button
            variant='secondary'
            asChild
            className='group border-primary-500 bg-primary-50 font-bold text-primary-500 hover:bg-primary-100'
          >
            <Link href='/events' className='flex items-center gap-2'>
              View all events
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
