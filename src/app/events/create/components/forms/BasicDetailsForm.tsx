'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { basicDetailsSchema } from '@/lib/validations/event-schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { useEventForm } from '../../context/EventFormContext';

type FormData = z.infer<typeof basicDetailsSchema>;

const categories = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'concert', label: 'Concert' },
  { value: 'exhibition', label: 'Exhibition' }
] as const;

export function BasicDetailsForm() {
  const { state, dispatch } = useEventForm();

  const form = useForm<FormData>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      title: state.basicDetails.title || '',
      category: state.basicDetails.category || '',
      description: state.basicDetails.description || '',
      tags: state.basicDetails.tags || [],
      imageUrl: state.basicDetails.imageUrl || ''
    }
  });

  // Watch form values and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Only dispatch if the value is different from current state
      if (JSON.stringify(value) !== JSON.stringify(state.basicDetails)) {
        dispatch({
          type: 'UPDATE_BASIC_DETAILS',
          payload: value as FormData
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, form, state.basicDetails]);

  return (
    <Form {...form}>
      <form className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter event title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter event description'
                  className='h-32 resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='imageUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || ''}
                  onChange={field.onChange}
                  onRemove={() => field.onChange('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
