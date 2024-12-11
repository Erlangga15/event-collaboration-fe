import { Star } from 'lucide-react';
import { useState } from 'react';

import { cn, formatToIDDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { TableContainer, TableRow } from '../shared/Table';

interface PurchasedTicket {
  id: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    venueName: string;
    image: string | null;
  };
  ticketType: string;
  purchaseDate: string;
  status: 'UPCOMING' | 'COMPLETED';
}

interface ReviewFormProps {
  eventId: string;
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
}

const ReviewForm = ({ onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Rating</label>
        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={cn(
                'hover:text-primary-500',
                value <= rating ? 'text-primary-500' : 'text-gray-300'
              )}
            >
              <Star className='size-6 fill-current' />
            </button>
          ))}
        </div>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Review</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='w-full rounded-md border p-2'
          rows={4}
          placeholder='Share your experience...'
        />
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(rating, content)}
          disabled={rating === 0 || !content.trim()}
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

const tickets: PurchasedTicket[] = [
  {
    id: '1',
    event: {
      id: '1',
      name: 'Summer Music Festival',
      startDate: '2024-06-15T14:00:00Z',
      venueName: 'Central Park',
      image: null
    },
    ticketType: 'VIP',
    purchaseDate: '2024-01-10T08:30:00Z',
    status: 'UPCOMING'
  },
  {
    id: '2',
    event: {
      id: '2',
      name: 'Tech Conference 2024',
      startDate: '2024-03-20T09:00:00Z',
      venueName: 'Convention Center',
      image: null
    },
    ticketType: 'Regular',
    purchaseDate: '2024-01-05T10:15:00Z',
    status: 'COMPLETED'
  }
];

export const TicketList = () => {
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(
    null
  );

  const handleSubmitReview = async (rating: number, content: string) => {
    try {
      if (!selectedTicket) return;
      console.log('Submitting review:', {
        eventId: selectedTicket.event.id,
        rating,
        content
      });
      setSelectedTicket(null);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <Card className='h-full'>
      <CardHeader className='border-b bg-primary-500/5'>
        <CardTitle className='text-xl text-primary-500'>My Tickets</CardTitle>
        <CardDescription className='text-primary-700'>
          Your purchased event tickets
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <TableContainer>
          <div className='divide-y'>
            {/* Table Header */}
            <TableRow
              className='bg-gray-50 font-medium text-gray-500'
              columns={6}
            >
              <div>Event Name</div>
              <div>Date</div>
              <div>Venue</div>
              <div>Status</div>
              <div>Action</div>
            </TableRow>

            {/* Table Body */}
            <div className='divide-y'>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className='hover:bg-gray-50'
                  columns={6}
                >
                  <div>
                    <div className='font-medium text-gray-900'>
                      {ticket.event.name}
                    </div>
                    <div className='mt-1 text-sm text-gray-500'>
                      {ticket.ticketType}
                    </div>
                  </div>
                  <div className='text-gray-500'>
                    {formatToIDDate(ticket.event.startDate)}
                  </div>
                  <div className='text-gray-500'>{ticket.event.venueName}</div>
                  <div>
                    <Badge
                      className={cn(
                        'font-medium',
                        ticket.status === 'UPCOMING'
                          ? 'bg-primary-500 hover:bg-primary-600'
                          : 'bg-green-500 hover:bg-green-600'
                      )}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <div>
                    {ticket.status === 'COMPLETED' && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex w-full items-center justify-center gap-2 hover:bg-primary-50'
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <Star className='size-4 text-primary-500' />
                        Review
                      </Button>
                    )}
                  </div>
                </TableRow>
              ))}
            </div>
          </div>
        </TableContainer>
      </CardContent>

      <Dialog
        open={!!selectedTicket}
        onOpenChange={() => setSelectedTicket(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience at {selectedTicket?.event.name}
            </DialogDescription>
          </DialogHeader>
          <ReviewForm
            eventId={selectedTicket?.event.id || ''}
            onSubmit={handleSubmitReview}
            onCancel={() => setSelectedTicket(null)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
