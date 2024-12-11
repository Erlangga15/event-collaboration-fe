'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';

import type { EventCategory } from '@/types/event';

interface CategoryItem {
  id: EventCategory;
  label: string;
  description: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'MUSIC',
    label: 'Music',
    description: 'Concerts, festivals, and live performances',
    icon: 'music'
  },
  {
    id: 'SPORT',
    label: 'Sport',
    description: 'Games, tournaments, and athletic events',
    icon: 'dumbbell'
  },
  {
    id: 'ART',
    label: 'Art',
    description: 'Exhibitions, galleries, and performances',
    icon: 'palette'
  },
  {
    id: 'FOOD',
    label: 'Food',
    description: 'Food festivals, tastings, and culinary events',
    icon: 'utensils'
  },
  {
    id: 'BUSINESS',
    label: 'Business',
    description: 'Conferences, networking, and workshops',
    icon: 'briefcase'
  },
  {
    id: 'EDUCATION',
    label: 'Education',
    description: 'Workshops, seminars, and training sessions',
    icon: 'graduationCap'
  }
];

interface CategoryButtonProps {
  id: EventCategory;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: (id: EventCategory) => void;
}

const CategoryButton = ({
  id,
  label,
  description,
  icon,
  isSelected,
  onClick
}: CategoryButtonProps) => {
  const Icon = Icons[icon as keyof typeof Icons];

  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        'group flex flex-col items-center gap-2 rounded-lg p-4 transition-all hover:bg-primary-50 dark:hover:bg-primary-950/50',
        isSelected ? 'bg-primary-50 dark:bg-primary-950/50' : 'bg-muted/50'
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-full transition-colors',
          isSelected
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
};

export const CategoryFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') as EventCategory | null;

  const handleCategoryClick = useCallback(
    (categoryId: EventCategory) => {
      if (currentCategory === categoryId) {
        router.push('/events/search');
      } else {
        router.push(`/events/search?category=${categoryId}`);
      }
    },
    [currentCategory, router]
  );

  return (
    <div className='space-y-4'>
      <h2 className='font-heading text-2xl font-bold'>
        Explore <span className='text-primary-500'>Categories</span>
      </h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            {...category}
            isSelected={currentCategory === category.id}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  );
};
