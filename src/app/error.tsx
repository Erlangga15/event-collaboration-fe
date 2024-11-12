'use client';

import Link from 'next/link';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export default function ErrorComponent({
  error
}: Readonly<{
  error: Error & { digest?: string };
}>) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className='bg-white'>
      <div className='layout flex min-h-[calc(100vh-64px)] flex-col items-center justify-center text-center'>
        <RiAlarmWarningFill
          size={60}
          className={cn('animate-flicker text-red-500')}
        />
        <h1 className='mt-8 font-heading text-4xl font-bold md:text-6xl'>
          Oops, something went wrong!
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          Don't worry, our team has been notified.
        </p>
        <Button asChild className='mt-8 bg-primary-500 hover:bg-primary-600'>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </section>
  );
}
