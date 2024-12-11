import { Star } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export interface ReviewFormProps {
  eventId: string;
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
}
export const ReviewForm = ({ onSubmit, onCancel }: ReviewFormProps) => {
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
