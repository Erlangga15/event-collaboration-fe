import { cn, formatToIDDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { TableContainer, TableRow } from '../shared/Table';

interface Event {
  id: string;
  name: string;
  startDate: string;
  venueName: string;
  status: 'UPCOMING' | 'COMPLETED';
  ticketsSold: number;
}

const events: Event[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    startDate: '2024-06-15T14:00:00Z',
    venueName: 'Central Park',
    status: 'UPCOMING',
    ticketsSold: 150
  },
  {
    id: '2',
    name: 'Tech Conference 2024',
    startDate: '2024-03-20T09:00:00Z',
    venueName: 'Convention Center',
    status: 'COMPLETED',
    ticketsSold: 300
  }
];

export const MyEvents = () => {
  return (
    <Card className='h-full'>
      <CardHeader className='border-b bg-primary-500/5'>
        <CardTitle className='text-xl text-primary-500'>My Events</CardTitle>
        <CardDescription className='text-primary-700'>
          Events you have organized
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <TableContainer>
          <div className='divide-y'>
            {/* Table Header */}
            <TableRow
              className='bg-gray-50 font-medium text-gray-500'
              columns={5}
            >
              <div>Event Name</div>
              <div>Date</div>
              <div>Venue</div>
              <div>Status</div>
              <div className='text-right'>Tickets Sold</div>
            </TableRow>

            {/* Table Body */}
            <div className='divide-y'>
              {events.map((event) => (
                <TableRow
                  key={event.id}
                  className='hover:bg-gray-50'
                  columns={5}
                >
                  <div>
                    <div className='font-medium text-gray-900'>
                      {event.name}
                    </div>
                  </div>
                  <div className='text-gray-500'>
                    {formatToIDDate(event.startDate)}
                  </div>
                  <div className='text-gray-500'>{event.venueName}</div>
                  <div>
                    <Badge
                      className={cn(
                        'font-medium',
                        event.status === 'UPCOMING'
                          ? 'bg-primary-500 hover:bg-primary-600'
                          : 'bg-green-500 hover:bg-green-600'
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className='text-right font-medium text-gray-900'>
                    {event.ticketsSold}
                  </div>
                </TableRow>
              ))}
            </div>
          </div>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
