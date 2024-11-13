import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const EventCardSkeleton = () => {
  return (
    <Card className='group relative h-full'>
      <div className='ribbon-container'>
        <div className='relative aspect-[4/3]'>
          <Skeleton className='size-full rounded-t-lg' />
          <div className='ribbon-right'>
            <Skeleton className='size-full rounded-md rounded-tr-none' />
          </div>
        </div>
      </div>
      <CardContent className='relative space-y-3 p-4'>
        <Skeleton className='h-5 w-3/4' />
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
  );
};
