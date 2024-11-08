'use client'; // Error components must be Client Components

import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import { cn } from '@/lib/utils';

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
    <main>
      <section className={cn('bg-white')}>
        <div
          className={cn(
            'layout flex min-h-screen flex-col items-center justify-center text-center text-black'
          )}
        >
          <RiAlarmWarningFill
            size={60}
            className={cn('animate-flicker text-red-500')}
          />
          <h1 className={cn('mt-8 text-4xl md:text-6xl')}>
            Oops, something went wrong!
          </h1>
        </div>
      </section>
    </main>
  );
}
