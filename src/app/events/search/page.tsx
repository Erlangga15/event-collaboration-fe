'use client';

import { useState } from 'react';

import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';
import { EventGrid } from '@/components/home/EventGrid';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterPanel } from '@/components/shared/SearchBar/FilterPanel';

import type { Event } from '@/constant/types/event';

export default function AdvancedSearchPage() {
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length < 3) return;
    setIsLoading(true);
    // TODO: Implement actual search API call
    // const results = await searchEvents(searchTerm);
    setIsLoading(false);
  };

  const handleFilterChange = async (filters: any) => {
    setIsLoading(true);
    // TODO: Implement actual filter API call
    // const results = await filterEvents(filters);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className='flex h-64 items-center justify-center text-gray-500'>
          No events found. Try adjusting your search or filters.
        </div>
      );
    }

    return (
      <EventGrid
        className='w-full'
        events={searchResults}
        isLoading={isLoading}
      />
    );
  };

  return (
    <main className='layout min-h-screen py-12'>
      <div className='mb-8'>
        <h1 className='mb-4 font-heading text-3xl font-bold'>
          Event <span className='text-primary-500'>Search</span>
        </h1>
        <p className='text-gray-600'>
          Find the perfect event with our advanced search and filtering options.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-[300px,1fr]'>
        {/* Filter Panel */}
        <aside>
          <FilterPanel
            onFilterChange={handleFilterChange}
            className='sticky top-24'
          />
        </aside>

        {/* Search Results */}
        <div className='space-y-6'>
          <SearchBar
            onSearch={handleSearch}
            className='mb-6'
            placeholder='Search events by name, description, or location...'
            variant='advanced'
          />

          {renderContent()}
        </div>
      </div>
    </main>
  );
}
