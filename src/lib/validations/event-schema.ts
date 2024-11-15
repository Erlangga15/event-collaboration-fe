import * as z from 'zod';

export const basicDetailsSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag'),
  imageUrl: z.string().url('Please enter a valid image URL').optional()
});

export const dateLocationSchema = z.object({
  startDate: z.date({
    required_error: 'Please select a start date'
  }),
  endDate: z.date({
    required_error: 'Please select an end date'
  }),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().min(1, 'Please select an end time'),
  timezone: z.string().min(1, 'Please select a timezone'),
  venue: z.string().min(1, 'Please enter a venue'),
  address: z.string().min(1, 'Please enter an address'),
  city: z.string().min(1, 'Please enter a city'),
  country: z.string().min(1, 'Please select a country')
});

const ticketSchema = z.object({
  name: z.string().min(1, 'Please enter a ticket name'),
  type: z.enum(['free', 'paid', 'donation']),
  price: z
    .number()
    .min(0, 'Price must be greater than or equal to 0')
    .optional(),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity must be less than 10000'),
  description: z.string().optional()
});

export const ticketsSchema = z.object({
  tickets: z.array(ticketSchema).min(1, 'Please add at least one ticket')
});

const promotionSchema = z.object({
  code: z.string().min(1, 'Please enter a promotion code'),
  discount: z
    .number()
    .min(0, 'Discount must be greater than or equal to 0')
    .max(100, 'Discount must be less than or equal to 100'),
  maxUses: z
    .number()
    .min(1, 'Maximum uses must be at least 1')
    .max(1000, 'Maximum uses must be less than 1000')
});

export const promotionsSchema = z.object({
  promotions: z.array(promotionSchema).optional()
});

export const eventFormSchema = z.object({
  basicDetails: basicDetailsSchema,
  dateLocation: dateLocationSchema,
  tickets: ticketsSchema,
  promotions: promotionsSchema
});

export type EventFormData = z.infer<typeof eventFormSchema>;
