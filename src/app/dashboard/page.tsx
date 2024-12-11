'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthContext } from '@/components/providers/AuthProvider';

import { MyEvents } from './components/events/MyEvents';
import { UserProfile } from './components/profile/UserProfile';
import { TicketList } from './components/tickets/TicketList';

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='border-primary size-12 animate-spin rounded-full border-y-2' />
      </div>
    );
  }

  return (
    <div className='layout min-h-screen py-10'>
      <div className='mx-auto w-full max-w-7xl space-y-6 px-4 md:px-6 lg:grid lg:grid-cols-[350px,1fr] lg:gap-6 lg:space-y-0'>
        <UserProfile
          fullName={user.fullName}
          email={user.email}
          role={user.role}
          onLogout={logout}
        />
        {user.role === 'CUSTOMER' ? <TicketList /> : <MyEvents />}
      </div>
    </div>
  );
};

export default DashboardPage;
