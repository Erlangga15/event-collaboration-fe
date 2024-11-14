'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Icons } from '@/components/shared/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { SAMPLE_REVIEWS } from '@/constant/data/reviews';
import type { Review } from '@/constant/types/event';

const reviewSchema = z.object({
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must not exceed 500 characters')
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  eventId: string;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const ReviewSection = ({ eventId }: ReviewSectionProps) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [reviews, setReviews] = React.useState<Review[]>(SAMPLE_REVIEWS);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: ''
    }
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const onSubmit = (data: ReviewFormValues) => {
    // Handle review submission
  };

  return (
    <Card className='p-6'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Reviews</h2>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-bold'>4.8</span>
            <div className='flex'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icons.star
                  key={i}
                  className='size-5 fill-primary-500 text-primary-500'
                />
              ))}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Write your review...'
                      className='min-h-[100px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='bg-primary-500 text-white hover:bg-primary-600'
            >
              Submit Review
            </Button>
          </form>
        </Form>

        <div className='space-y-6'>
          {reviews.map((review) => (
            <div key={review.id} className='space-y-2'>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src={review.user.image} alt={review.user.name} />
                  <AvatarFallback>
                    {review.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{review.user.name}</div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <div className='flex'>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Icons.star
                          key={i}
                          className='size-4 fill-primary-500 text-primary-500'
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              <p className='text-muted-foreground'>{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
