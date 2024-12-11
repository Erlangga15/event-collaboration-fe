import { cn } from '@/lib/utils';

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
}

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableRow = ({
  children,
  className,
  columns = 5
}: TableRowProps) => (
  <div
    className={cn(
      'grid items-center gap-4 px-6 py-4 text-sm',
      {
        'grid-cols-[2fr,1fr,1fr,1fr,1fr]': columns === 5,
        'grid-cols-[2fr,1fr,1fr,0.7fr,0.7fr]': columns === 6
      },
      className
    )}
  >
    {children}
  </div>
);

export const TableContainer = ({ children }: TableContainerProps) => (
  <div className='w-full overflow-hidden rounded-lg'>
    <div className='overflow-x-auto'>
      <div className='inline-block min-w-[720px] w-full'>{children}</div>
    </div>
  </div>
);
