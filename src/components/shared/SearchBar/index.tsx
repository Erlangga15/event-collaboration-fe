'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SearchSuggestions } from './SearchSuggestions';

interface SearchBarProps {
  className?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'advanced';
}

export const SearchBar = ({
  className,
  onSearch,
  placeholder = 'Search events, venues, or cities...',
  variant = 'default'
}: SearchBarProps) => {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (variant === 'default') {
        router.push(`/events?q=${encodeURIComponent(query.trim())}`);
        setIsFocused(false);
        inputRef.current?.blur();
      } else if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);
    if (variant === 'advanced' && onSearch) {
      onSearch(value);
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
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className='h-full flex-1 border-0 bg-transparent p-0'
            ringOnFocus={false}
          />
          {query && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setQuery('')}
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

      {variant === 'default' && isFocused && debouncedQuery.length >= 2 && (
        <SearchSuggestions
          query={debouncedQuery}
          onClose={() => {
            setIsFocused(false);
            setIsLoading(false);
          }}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};
