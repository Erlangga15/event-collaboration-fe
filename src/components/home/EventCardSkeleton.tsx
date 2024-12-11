import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLineProps {
  width: string;
  height?: string;
  className?: string;
}

const SkeletonLine = ({
  width,
  height = 'h-4',
  className
}: SkeletonLineProps) => (
  <Skeleton className={`${height} ${width} ${className ?? ''}`} />
);

const SkeletonIcon = () => <Skeleton className='size-4 shrink-0' />;

const InfoLine = ({ width }: { width: string }) => (
  <div className='flex items-center gap-2'>
    <SkeletonIcon />
    <SkeletonLine width={width} />
  </div>
);

export const EventCardSkeleton = () => (
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
      <SkeletonLine width='w-3/4' height='h-5' />
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
