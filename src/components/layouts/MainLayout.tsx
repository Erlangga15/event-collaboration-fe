'use client';

import { cn } from '@/lib/utils';

import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className='relative flex min-h-screen flex-col'>
      <Header />
      <main className={cn('flex-1', className)}>{children}</main>
      <Footer />
    </div>
  );
};
