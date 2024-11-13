'use client';

import Link from 'next/link';
import * as React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { Icons } from '@/components/shared/Icons';

interface SearchSuggestionsProps {
  query: string;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SearchSuggestions = ({
  query,
  onClose,
  isLoading,
  setIsLoading
}: SearchSuggestionsProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  const [suggestions, setSuggestions] = React.useState<
    Array<{
      id: string;
      title: string;
      subtitle: string;
      icon: keyof typeof Icons;
    }>
  >([]);

  React.useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setSuggestions([
        {
          id: '1',
          title: 'Summer Music Festival 2024',
          subtitle: 'Music Festival • Jakarta',
          icon: 'music'
        },
        {
          id: '2',
          title: 'Tech Conference 2024',
          subtitle: 'Conference • Bandung',
          icon: 'briefcase'
        }
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, setIsLoading]);

  return (
    <div
      ref={ref}
      className='absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border bg-background/95 shadow-lg backdrop-blur-sm'
    >
      {isLoading ? (
        <div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>
          <Icons.spinner className='mr-2 size-4 animate-spin' />
          Searching...
        </div>
      ) : suggestions.length > 0 ? (
        <div>
          {suggestions.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <Link
                key={item.id}
                href={`/events?q=${encodeURIComponent(item.title)}`}
                className='flex items-center gap-3 border-b px-4 py-3 text-sm transition-colors last:border-0 hover:bg-accent/50'
                onClick={onClose}
              >
                <Icon className='size-4 shrink-0 text-muted-foreground' />
                <div className='flex flex-col'>
                  <span className='font-medium'>{item.title}</span>
                  <span className='text-xs text-muted-foreground'>
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className='p-4 text-center text-sm text-muted-foreground'>
          No results found
        </div>
      )}
    </div>
  );
};
