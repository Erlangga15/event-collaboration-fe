import { useKeenSlider } from 'keen-slider/react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SLIDER_CONFIG = {
  slides: {
    perView: 1.2,
    spacing: 16
  },
  breakpoints: {
    '(min-width: 768px)': {
      slides: { perView: 2.2, spacing: 16 }
    },
    '(min-width: 1024px)': {
      slides: { perView: 3.2, spacing: 16 }
    }
  },
  initial: 0,
  mode: 'snap' as const,
  renderMode: 'performance' as const
} as const;

const SKELETON_COUNT = 4;

interface SkeletonLineProps {
  width: string;
  height?: string;
}

const SkeletonLine = ({ width, height = 'h-4' }: SkeletonLineProps) => (
  <Skeleton className={`${height} ${width}`} />
);

const SkeletonIcon = () => <Skeleton className='size-4 shrink-0' />;

const InfoLine = ({ width }: { width: string }) => (
  <div className='flex items-center gap-2'>
    <SkeletonIcon />
    <SkeletonLine width={width} />
  </div>
);

const EventCardSkeleton = () => (
  <Card className='group relative h-full transition-all hover:shadow-lg'>
    <div className='ribbon-container z-10'>
      <div className='relative aspect-video'>
        <Skeleton className='size-full rounded-t-lg' />
        <div className='ribbon-right flex items-center justify-center rounded-md rounded-tr-none'>
          <Skeleton className='size-full' />
        </div>
      </div>
    </div>
    <CardContent className='relative space-y-3 p-4'>
      <div className='pt-2'>
        <SkeletonLine width='w-3/4' height='h-5' />
      </div>
      <div className='space-y-2'>
        <InfoLine width='w-24' />
        <InfoLine width='w-32' />
      </div>
      <div className='border-t pt-3'>
        <SkeletonLine width='w-20' height='h-5' />
      </div>
    </CardContent>
  </Card>
);

export const FeaturedEventsSkeleton = () => {
  const [sliderRef] = useKeenSlider(SLIDER_CONFIG);

  return (
    <div ref={sliderRef} className='keen-slider overflow-visible'>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div key={index} className='keen-slider__slide !overflow-visible'>
          <EventCardSkeleton />
        </div>
      ))}
    </div>
  );
};
