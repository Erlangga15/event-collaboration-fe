import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { cn, formatToIDR } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  date?: Date;
  priceRange: [number, number];
  category: string[];
  location?: string;
  hasAvailableSeats: boolean;
  sortBy?: string;
}

const categories = [
  'Music',
  'Sports',
  'Arts',
  'Food',
  'Technology',
  'Business',
  'Lifestyle'
];

const locations = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali',
  'Medan'
];

const sortOptions = [
  { value: 'date-asc', label: 'Date (Nearest)' },
  { value: 'date-desc', label: 'Date (Furthest)' },
  { value: 'price-asc', label: 'Price (Low-High)' },
  { value: 'price-desc', label: 'Price (High-Low)' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' }
];

export function FilterPanel({
  onFilterChange,
  className
}: Readonly<FilterPanelProps>) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    category: [],
    hasAvailableSeats: false
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      {/* Date Picker */}
      <div className='space-y-2'>
        <label htmlFor='datePicker' className='text-sm font-medium'>
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id='datePicker'
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !filters.date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 size-4' />
              {filters.date ? format(filters.date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={filters.date}
              onSelect={(date) => handleFilterChange({ date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Price Range */}
      <div className='space-y-2'>
        <label htmlFor='priceRange' className='text-sm font-medium'>
          Price Range
        </label>
        <Slider
          id='priceRange'
          defaultValue={[0, 1000000]}
          max={1000000}
          step={50000}
          onValueChange={(value) =>
            handleFilterChange({ priceRange: value as [number, number] })
          }
        />
        <div className='flex justify-between'>
          <span>Min Price</span>
          <span>{formatToIDR(filters.priceRange[0])}</span>
        </div>
        <div className='flex justify-between'>
          <span>Max Price</span>
          <span>{formatToIDR(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Category Select */}
      <div className='space-y-2'>
        <label htmlFor='categorySelect' className='text-sm font-medium'>
          Category
        </label>
        <Select
          onValueChange={(value) =>
            handleFilterChange({ category: [...filters.category, value] })
          }
        >
          <SelectTrigger id='categorySelect'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Select */}
      <div className='space-y-2'>
        <label htmlFor='locationSelect' className='text-sm font-medium'>
          Location
        </label>
        <Select
          onValueChange={(value) => handleFilterChange({ location: value })}
        >
          <SelectTrigger id='locationSelect'>
            <SelectValue placeholder='Select location' />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className='space-y-2'>
        <label htmlFor='sortSelect' className='text-sm font-medium'>
          Sort By
        </label>
        <Select
          onValueChange={(value) => handleFilterChange({ sortBy: value })}
        >
          <SelectTrigger id='sortSelect'>
            <SelectValue placeholder='Select sorting' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Available Seats Toggle */}
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='availableSeats'
          checked={filters.hasAvailableSeats}
          onChange={(e) =>
            handleFilterChange({ hasAvailableSeats: e.target.checked })
          }
          className='size-4 rounded border-gray-300'
        />
        <label htmlFor='availableSeats' className='text-sm font-medium'>
          Show only available seats
        </label>
      </div>

      {/* Clear Filters */}
      <Button
        variant='outline'
        className='w-full'
        onClick={() =>
          handleFilterChange({
            date: undefined,
            priceRange: [0, 1000000],
            category: [],
            location: undefined,
            hasAvailableSeats: false,
            sortBy: undefined
          })
        }
      >
        Clear All Filters
      </Button>
    </div>
  );
}
