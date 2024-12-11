'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  className?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'advanced';
  defaultValue?: string;
}

export const SearchBar = ({
  className,
  onSearch,
  placeholder = 'Search events, venues, or cities...',
  variant = 'default',
  defaultValue = ''
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 1000);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current && variant === 'advanced') {
      isInitialMount.current = false;
      const searchTerm = searchParams.get('searchTerm');
      if (searchTerm && searchTerm !== query) {
        setQuery(searchTerm);
      }
    }
  }, [searchParams, variant, query]);

  React.useEffect(() => {
    if (!isInitialMount.current && variant === 'advanced' && onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, variant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (variant === 'default') {
        router.push(
          `/events/search?searchTerm=${encodeURIComponent(query.trim())}`
        );
        inputRef.current?.blur();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    if (variant === 'advanced' && onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      <form onSubmit={handleSubmit}>
        <div className='relative flex h-12 items-center gap-2 overflow-hidden rounded-lg border bg-background px-3 shadow-sm transition-shadow duration-200 focus-within:shadow-md hover:shadow-md'>
          <Icons.search className='size-4 shrink-0 text-muted-foreground' />
          <Input
            ref={inputRef}
            type='text'
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className='h-full flex-1 border-0 bg-transparent p-0'
            ringOnFocus={false}
          />
          {query && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleClear}
              className='size-6 p-0'
            >
              <Icons.x className='size-4 text-muted-foreground' />
            </Button>
          )}
          <div className='h-4 w-px bg-border' />
          <Button
            type='submit'
            variant='default'
            size='sm'
            className='hover:bg-primary/90 h-8 bg-primary-500 px-4 font-medium text-primary-foreground'
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};
