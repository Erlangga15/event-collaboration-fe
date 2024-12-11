'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { EventGrid } from '@/components/home/EventGrid';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterPanel } from '@/components/shared/SearchBar/FilterPanel';
import { Button } from '@/components/ui/button';

import type { EventFilter } from '@/services/event';
import eventApi from '@/services/event';

import type { Event } from '@/types/event';

const ITEMS_PER_PAGE = 8;

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<Partial<EventFilter>>({});
  const isInitialMount = useRef(true);

  const fetchEvents = useCallback(
    async (filter: Partial<EventFilter>, page = 0) => {
      setIsLoading(true);
      try {
        const response = await eventApi.getEvents({
          ...filter,
          page,
          size: ITEMS_PER_PAGE
        });

        setEvents(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const buildFilter = useCallback(
    (
      params: {
        searchTerm?: string;
        additionalFilters?: Partial<EventFilter>;
      } = {}
    ) => {
      const { searchTerm, additionalFilters = {} } = params;
      const category = searchParams.get('category');

      return {
        ...(searchTerm && searchTerm.length >= 3 && { searchTerm }),
        ...(category && { category }),
        ...additionalFilters
      };
    },
    [searchParams]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const newFilter = buildFilter({ searchTerm });
      setCurrentFilter(newFilter);
      fetchEvents(newFilter, 0);
    },
    [buildFilter, fetchEvents]
  );

  const handleFilterChange = useCallback(
    (filters: Partial<EventFilter>) => {
      const newFilter = buildFilter({ additionalFilters: filters });
      setCurrentFilter(newFilter);
      fetchEvents(newFilter, 0);
    },
    [buildFilter, fetchEvents]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchEvents(currentFilter, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentFilter, fetchEvents]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const searchTerm = searchParams.get('searchTerm');
      const newFilter = buildFilter({ searchTerm: searchTerm ?? undefined });
      setCurrentFilter(newFilter);
      fetchEvents(newFilter, 0);
    }
  }, [searchParams, fetchEvents, buildFilter]);

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
        <aside>
          <FilterPanel
            onFilterChange={handleFilterChange}
            className='sticky top-24'
          />
        </aside>

        <div className='space-y-6'>
          <SearchBar
            onSearch={handleSearch}
            className='mb-6'
            placeholder='Search events by name, description, or location...'
            variant='advanced'
            defaultValue={searchParams.get('searchTerm') || ''}
          />

          <EventGrid events={events} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-8 flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || isLoading}
                className='size-8 p-0'
              >
                {'<'}
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handlePageChange(i)}
                  disabled={isLoading}
                  className={`size-8 p-0 ${
                    currentPage === i
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : ''
                  }`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || isLoading}
                className='size-8 p-0'
              >
                {'>'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
