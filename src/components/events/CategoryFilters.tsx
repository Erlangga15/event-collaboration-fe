'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';

import { type CategoryId, CATEGORIES } from '@/constant/event-data';

export const CategoryFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') as CategoryId | null;

  const handleCategoryClick = (categoryId: CategoryId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategory === categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className='space-y-4'>
      <h2 className='font-heading text-2xl font-bold'>Explore Categories</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {CATEGORIES.map(({ id, label, description, icon }) => {
          const Icon = Icons[icon];
          return (
            <button
              key={id}
              onClick={() => handleCategoryClick(id)}
              className={cn(
                'group flex flex-col items-center gap-2 rounded-lg p-4 transition-all hover:bg-primary-50 dark:hover:bg-primary-950/50',
                currentCategory === id
                  ? 'bg-primary-50 dark:bg-primary-950/50'
                  : 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex size-12 items-center justify-center rounded-full transition-colors',
                  currentCategory === id
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-100 text-primary-500 group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-950 dark:text-primary-400'
                )}
              >
                <Icon className='size-6' />
              </div>
              <div className='text-center'>
                <p className='font-medium'>{label}</p>
                <p className='text-xs text-muted-foreground'>{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
