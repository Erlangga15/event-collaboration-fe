import { LogOut } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface UserProfileProps {
  fullName: string;
  email: string;
  role: string;
  onLogout: () => void;
}

export const UserProfile = ({
  fullName,
  email,
  role,
  onLogout
}: UserProfileProps) => (
  <Card className='h-full'>
    <CardHeader className='border-b bg-primary-500/5'>
      <CardTitle className='text-xl text-primary-500'>Profile</CardTitle>
      <CardDescription className='text-primary-700'>
        Welcome back! Here&apos;s your profile information.
      </CardDescription>
    </CardHeader>
    <CardContent className='flex min-h-[300px] flex-col p-6'>
      <div className='flex-1 space-y-6'>
        <div className='flex flex-col items-center gap-4'>
          <Avatar className='size-24 border-4 border-primary-100'>
            <AvatarFallback className='bg-primary-500 text-xl text-white'>
              {fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>{fullName}</h2>
            <p className='text-gray-500'>{email}</p>
            <Badge className='mt-2 bg-primary-500'>{role}</Badge>
          </div>
        </div>
      </div>

      <Button
        variant='destructive'
        className='mt-6 w-full transition-all hover:bg-red-600'
        onClick={onLogout}
      >
        <LogOut className='mr-2 size-4' />
        Sign Out
      </Button>
    </CardContent>
  </Card>
);
