'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import type { EventFilter } from '@/services/event';

import type { EventCategory } from '@/types/event';

const categories: Array<{ value: EventCategory; label: string }> = [
  { value: 'MUSIC', label: 'Music' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'ART', label: 'Art' },
  { value: 'FOOD', label: 'Food' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'EDUCATION', label: 'Education' }
];

const ticketTypes = [
  { value: 'PAID', label: 'Paid' },
  { value: 'FREE', label: 'Free' }
];

const locations = [
  { value: 'JAKARTA', label: 'Jakarta' },
  { value: 'SURABAYA', label: 'Surabaya' },
  { value: 'BANDUNG', label: 'Bandung' },
  { value: 'SEMARANG', label: 'Semarang' },
  { value: 'YOGYAKARTA', label: 'Yogyakarta' },
  { value: 'DENPASAR', label: 'Denpasar' }
];

interface FilterPanelProps {
  className?: string;
  onFilterChange: (filters: Partial<EventFilter>) => void;
}

export const FilterPanel = ({
  className,
  onFilterChange
}: FilterPanelProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Partial<EventFilter>>({});

  useEffect(() => {
    const categoryFromUrl = searchParams.get(
      'category'
    ) as EventCategory | null;
    if (categoryFromUrl && !filters.category) {
      const newFilters = { ...filters, category: categoryFromUrl };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  }, [searchParams, filters, onFilterChange]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<EventFilter>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
    router.push('/events/search');
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className='space-y-2'>
        <label htmlFor='categorySelect' className='text-sm font-medium'>
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange({ category: value })}
        >
          <SelectTrigger id='categorySelect'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label htmlFor='ticketType' className='text-sm font-medium'>
          Ticket Type
        </label>
        <Select
          value={filters.ticketType}
          onValueChange={(value) =>
            handleFilterChange({ ticketType: value as 'PAID' | 'FREE' })
          }
        >
          <SelectTrigger id='ticketType'>
            <SelectValue placeholder='Select ticket type' />
          </SelectTrigger>
          <SelectContent>
            {ticketTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label htmlFor='locationSelect' className='text-sm font-medium'>
          Location
        </label>
        <Select
          value={filters.location}
          onValueChange={(value) => handleFilterChange({ location: value })}
        >
          <SelectTrigger id='locationSelect'>
            <SelectValue placeholder='Select location' />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant='outline' className='w-full' onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};
