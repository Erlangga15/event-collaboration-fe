import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Not Found'
};

export default function NotFound() {
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
          <h1 className={cn('mt-8 text-4xl md:text-6xl')}>Page Not Found</h1>
          <a href='/'>Back to home</a>
        </div>
      </section>
    </main>
  );
}
