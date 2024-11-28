'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { useAuthContext } from '@/components/providers/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  return (
    <div className='layout min-h-screen py-10'>
      <div className='mx-auto max-w-2xl space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Welcome back! Here&apos;s your profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-20'>
                <AvatarFallback className='text-lg'>
                  {user.fullName
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-2xl font-bold'>{user.fullName}</h2>
                <p className='text-muted-foreground'>{user.email}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='font-medium'>Account Details</h3>
                <div className='mt-2 space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <User className='size-4' />
                    <span className='text-muted-foreground'>Role:</span>
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>

              <Button
                variant='destructive'
                className='w-full'
                onClick={() => logout()}
              >
                <LogOut className='size-4' />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
