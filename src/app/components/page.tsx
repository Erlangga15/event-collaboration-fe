'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

export default function Page() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <h1 className='mt-4'>EventHub-Page</h1>
        </div>
      </section>
    </main>
  );
}
