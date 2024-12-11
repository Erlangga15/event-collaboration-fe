'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { CategoryFilters } from '@/components/home/CategoryFilters';
import { CreateEventBanner } from '@/components/home/CreateEventBanner';
import { EventGrid } from '@/components/home/EventGrid';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';

import eventApi from '@/services/event';

import type { Event } from '@/types/event';

const ITEMS_PER_PAGE = 8;

interface SectionHeadingProps {
  title: string;
  highlightedWord: string;
}

const SectionHeading = ({ title, highlightedWord }: SectionHeadingProps) => (
  <h2 className='font-heading text-2xl font-bold sm:text-3xl'>
    {title} <span className='text-primary-500'>{highlightedWord}</span>
  </h2>
);

const ViewAllButton = () => (
  <Button
    variant='secondary'
    asChild
    className='group border-primary-500 bg-primary-50 font-bold text-primary-500 hover:bg-primary-100'
  >
    <Link href='/events/search' className='flex items-center gap-2'>
      View all events
    </Link>
  </Button>
);

const HeroSection = () => (
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
        Discover <span className='text-primary-700'>Amazing Events </span> Near
        You
      </h1>
      <p className='max-w-2xl text-lg text-gray-100 sm:text-xl'>
        Find and book tickets for concerts, festivals, workshops, and more. Your
        next unforgettable experience starts here.
      </p>
      <SearchBar className='w-full max-w-2xl' />
    </div>
  </section>
);

const EventSection = ({
  title,
  highlightedWord,
  children
}: {
  title: string;
  highlightedWord: string;
  children: React.ReactNode;
}) => (
  <section className='layout space-y-6 py-12'>
    <SectionHeading title={title} highlightedWord={highlightedWord} />
    {children}
    <div className='flex justify-center'>
      <ViewAllButton />
    </div>
  </section>
);

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);

  const fetchUpcomingEvents = useCallback(async () => {
    setIsLoadingUpcoming(true);
    try {
      const response = await eventApi.getEvents({
        page: 0,
        size: ITEMS_PER_PAGE
      });
      setUpcomingEvents(response.content);
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
    } finally {
      setIsLoadingUpcoming(false);
    }
  }, []);

  const fetchFeaturedEvents = useCallback(async () => {
    setIsLoadingFeatured(true);
    try {
      const response = await eventApi.getEvents({
        featured: true,
        size: 6
      });
      setFeaturedEvents(response.content);
    } catch (error) {
      console.error('Failed to fetch featured events:', error);
    } finally {
      setIsLoadingFeatured(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchFeaturedEvents();
  }, [fetchUpcomingEvents, fetchFeaturedEvents]);

  return (
    <main>
      <HeroSection />

      <section className='layout py-12'>
        <CategoryFilters />
      </section>

      <EventSection title='Upcoming' highlightedWord='Events'>
        <EventGrid events={upcomingEvents} isLoading={isLoadingUpcoming} />
      </EventSection>

      <CreateEventBanner />

      <EventSection title='Featured' highlightedWord='Events'>
        <FeaturedEvents events={featuredEvents} isLoading={isLoadingFeatured} />
      </EventSection>
    </main>
  );
};

export default HomePage;
