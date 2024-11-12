'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ThemeToggle } from '@/components/shared/Header/ThemeToggle';
import { UserMenu } from '@/components/shared/Header/UserMenu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

const navigation = [
  { name: 'Browse Events', href: '/events/search' },
  { name: 'Create Event', href: '/events/create' },
  { name: 'About', href: '/about' }
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <nav className='layout flex h-14 items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/favicon/favicon-96x96.png'
              alt='EventHub Logo'
              width={32}
              height={32}
              className='size-8'
            />
            <span className='font-heading text-xl font-bold'>
              Event<span className='text-primary-500'>Hub</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden items-center gap-6 md:flex'>
          {navigation.map(({ name, href }) => (
            <li key={name}>
              <Link
                href={href}
                className={cn(
                  'animated-underline relative inline-flex items-center px-1 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-primary-500'
                    : 'hover:text-primary-500'
                )}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-2'>
          <div className='hidden items-center gap-2 md:flex'>
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon' className='shrink-0'>
                <Menu className='size-5' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader>
                <SheetTitle>
                  Event<span className='text-primary-500'>Hub</span>
                </SheetTitle>
              </SheetHeader>
              <div className='mt-4 flex flex-col gap-4'>
                {navigation.map(({ name, href }) => (
                  <Link
                    key={name}
                    href={href}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      pathname === href
                        ? 'text-primary-500'
                        : 'hover:text-primary-500'
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
