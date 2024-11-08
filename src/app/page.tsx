'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>EventHub</title>
      </Head>
      <section className={cn('bg-white')}>
        <div
          className={cn(
            'layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'
          )}
        >
          <h1 className={cn('my-4 text-4xl text-primary-500')}>EventHub</h1>
          <Button
            variant='default'
            className='bg-primary-500 text-white hover:bg-primary-600'
          >
            Click me
          </Button>
        </div>
      </section>
    </main>
  );
}
