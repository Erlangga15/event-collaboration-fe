import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const Footer = () => {
  return (
    <footer className='border-t bg-background'>
      <div className='layout flex flex-col items-center gap-2 py-8 md:h-20 md:flex-row md:justify-between md:py-0'>
        <div className='flex flex-col items-center gap-2 md:flex-row md:gap-4'>
          <Link href='/'>
            <span className='font-heading font-bold'>
              Event<span className='text-primary-500'>Hub</span>
            </span>
          </Link>
          <p className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
        <div className='flex gap-4'>
          <Link
            href='/terms'
            className={cn(
              'hover:text-primary text-sm font-medium text-muted-foreground transition-colors'
            )}
          >
            Terms
          </Link>
          <Link
            href='/privacy'
            className={cn(
              'hover:text-primary text-sm font-medium text-muted-foreground transition-colors'
            )}
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
