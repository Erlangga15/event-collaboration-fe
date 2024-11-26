'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '@/components/shared/Icons';

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  heading: string;
  subheading?: string;
  className?: string;
  illustration?: {
    src: string;
    alt: string;
  };
}

export const AuthLayout = ({
  children,
  showBackButton = false,
  heading,
  subheading,
  className,
  illustration
}: AuthLayoutProps) => {
  return (
    <div className='container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {showBackButton && (
        <Link
          href='/'
          className='absolute left-4 top-4 z-20 flex items-center text-sm font-medium text-muted-foreground md:left-8 md:top-8'
        >
          <Icons.chevronLeft className='mr-2 size-4' />
          Back
        </Link>
      )}

      <div className='relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 z-0 bg-primary-500' />

        <div className='relative z-10 flex h-full flex-col'>
          <div className='h-20' />

          {illustration && (
            <div className='flex flex-1 items-center justify-center px-10'>
              <Image
                src={illustration.src}
                alt={illustration.alt}
                width={500}
                height={500}
                className='max-h-[500px] w-auto rounded-lg'
                priority
              />
            </div>
          )}

          <div className='p-10'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;EventHub has transformed how we manage our events. It's
                intuitive, powerful, and makes event planning a breeze.&rdquo;
              </p>
              <footer className='text-sm'>Sofia Davis, Event Manager</footer>
            </blockquote>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center p-4 lg:p-8'>
        <div
          className={cn(
            'mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]',
            className
          )}
        >
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>{heading}</h1>
            {subheading && (
              <p className='text-sm text-muted-foreground'>{subheading}</p>
            )}
          </div>
          {children}
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
