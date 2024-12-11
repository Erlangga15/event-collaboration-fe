'use client';

import { format } from 'date-fns';
import Image from 'next/image';

import { formatToIDR } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useEventForm } from '../../context/EventFormContext';

export function SummaryForm() {
  const { state } = useEventForm();
  const { basicDetails, dateLocation, tickets, promotions } = state;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Review your event details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Title</Label>
            <p className='text-sm text-muted-foreground'>
              {basicDetails.title}
            </p>
          </div>
          <div className='space-y-2'>
            <Label>Category</Label>
            <p className='text-sm capitalize text-muted-foreground'>
              {basicDetails.category}
            </p>
          </div>
          <div className='space-y-2'>
            <Label>Description</Label>
            <p className='text-sm text-muted-foreground'>
              {basicDetails.description}
            </p>
          </div>
          {basicDetails.imageUrl && (
            <div className='space-y-2'>
              <Label>Event Image</Label>
              <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                <Image
                  src={basicDetails.imageUrl}
                  alt={basicDetails.title || 'Event image'}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  priority={false}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date & Location</CardTitle>
          <CardDescription>
            Review your event schedule and venue
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Start Date</Label>
              <p className='text-sm text-muted-foreground'>
                {dateLocation.startDate
                  ? format(new Date(dateLocation.startDate), 'PPP')
                  : '-'}
              </p>
            </div>
            <div className='space-y-2'>
              <Label>End Date</Label>
              <p className='text-sm text-muted-foreground'>
                {dateLocation.endDate
                  ? format(new Date(dateLocation.endDate), 'PPP')
                  : '-'}
              </p>
            </div>
            <div className='space-y-2'>
              <Label>Start Time</Label>
              <p className='text-sm text-muted-foreground'>
                {dateLocation.startTime || '-'}
              </p>
            </div>
            <div className='space-y-2'>
              <Label>End Time</Label>
              <p className='text-sm text-muted-foreground'>
                {dateLocation.endTime || '-'}
              </p>
            </div>
          </div>
          <Separator />
          <div className='space-y-2'>
            <Label>Venue</Label>
            <p className='text-sm text-muted-foreground'>
              {dateLocation.venue || '-'}
            </p>
          </div>
          <div className='space-y-2'>
            <Label>Address</Label>
            <p className='text-sm text-muted-foreground'>
              {dateLocation.address || '-'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Review your ticket details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {tickets.tickets && tickets.tickets.length > 0 ? (
            tickets.tickets.map((ticket, index) => (
              <div key={index} className='space-y-4 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <Label className='text-base'>
                    {ticket.name || `Ticket ${index + 1}`}
                  </Label>
                  <span className='text-sm font-medium'>
                    {ticket.type === 'PAID'
                      ? formatToIDR(ticket.price || 0)
                      : 'Free'}
                  </span>
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label>Type</Label>
                    <p className='text-sm capitalize text-muted-foreground'>
                      {ticket.type}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label>Quantity</Label>
                    <p className='text-sm text-muted-foreground'>
                      {ticket.quantity || 0} tickets
                    </p>
                  </div>
                </div>
                {ticket.description && (
                  <div className='space-y-2'>
                    <Label>Description</Label>
                    <p className='text-sm text-muted-foreground'>
                      {ticket.description}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>No tickets added</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
          <CardDescription>Review your promotional offers</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {promotions.promotion ? (
            <div className='space-y-4 rounded-lg border p-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-base'>
                  Code:{' '}
                  <span className='font-semibold'>
                    {promotions.promotion.code}
                  </span>
                </Label>
                <span className='text-sm font-medium'>
                  {promotions.promotion.type === 'PERCENTAGE'
                    ? `${promotions.promotion.amount}% off`
                    : formatToIDR(promotions.promotion.amount)}
                </span>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Type</Label>
                  <p className='text-sm capitalize text-muted-foreground'>
                    {promotions.promotion.type === 'PERCENTAGE'
                      ? 'Percentage Discount'
                      : 'Fixed Amount'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <Label>Maximum Uses</Label>
                  <p className='text-sm text-muted-foreground'>
                    {promotions.promotion.maxUses} times
                  </p>
                </div>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Start Date</Label>
                  <p className='text-sm text-muted-foreground'>
                    {promotions.promotion.startDate
                      ? format(new Date(promotions.promotion.startDate), 'PPP')
                      : '-'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <Label>End Date</Label>
                  <p className='text-sm text-muted-foreground'>
                    {promotions.promotion.endDate
                      ? format(new Date(promotions.promotion.endDate), 'PPP')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No promotion added</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
