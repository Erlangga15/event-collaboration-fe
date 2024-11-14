import { useKeenSlider } from 'keen-slider/react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const FeaturedEventsSkeleton = () => {
  const [sliderRef] = useKeenSlider({
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
    mode: 'snap',
    renderMode: 'performance'
  });

  return (
    <div ref={sliderRef} className='keen-slider overflow-visible'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='keen-slider__slide !overflow-visible'>
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
                <Skeleton className='h-5 w-3/4' />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='size-4 shrink-0' />
                  <Skeleton className='h-4 w-24' />
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='size-4 shrink-0' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
              <div className='border-t pt-3'>
                <Skeleton className='h-5 w-20' />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
