import * as z from 'zod';

const EVENT_CATEGORIES = [
  'MUSIC',
  'SPORT',
  'ART',
  'FOOD',
  'BUSINESS',
  'EDUCATION'
] as const;
const TICKET_TYPES = ['PAID', 'FREE'] as const;

const isBase64Image = (value: string) => {
  if (!value) return false;
  try {
    if (value.startsWith('data:image')) {
      const [header, content] = value.split(',');
      return (
        content && Buffer.from(content, 'base64').toString('base64') === content
      );
    }
    return Buffer.from(value, 'base64').toString('base64') === value;
  } catch {
    return false;
  }
};

export const basicDetailsSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(EVENT_CATEGORIES, {
    required_error: 'Please select a category',
    invalid_type_error: 'Please select a valid category'
  }),
  imageUrl: z
    .string()
    .min(1, 'Image is required')
    .refine((val) => isBase64Image(val), {
      message: 'Invalid image format. Please provide a valid image.'
    })
});

export const dateLocationSchema = z
  .object({
    startDate: z.date({
      required_error: 'Please select a start date'
    }),
    endDate: z.date({
      required_error: 'Please select an end date'
    }),
    startTime: z.string().min(1, 'Please select a start time'),
    endTime: z.string().min(1, 'Please select an end time'),
    venue: z.string().min(1, 'Please enter a venue'),
    address: z.string().min(1, 'Please enter an address')
  })
  .refine(
    (data) => {
      const start = new Date(
        `${data.startDate.toISOString().split('T')[0]}T${data.startTime}`
      );
      const end = new Date(
        `${data.endDate.toISOString().split('T')[0]}T${data.endTime}`
      );
      return end > start;
    },
    {
      message: 'End date and time must be after start date and time',
      path: ['endDate']
    }
  );

const ticketSchema = z
  .object({
    name: z.string().min(1, 'Please enter a ticket name'),
    type: z.enum(TICKET_TYPES, {
      required_error: 'Please select a ticket type',
      invalid_type_error: 'Please select a valid ticket type'
    }),
    price: z
      .number()
      .min(0, 'Price must be greater than or equal to 0')
      .optional(),
    quantity: z
      .number()
      .min(1, 'Quantity must be at least 1')
      .max(10000, 'Quantity must be less than 10000'),
    description: z.string().optional()
  })
  .refine(
    (data) => {
      if (
        data.type === 'PAID' &&
        (data.price === undefined || data.price <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Price is required for paid tickets and must be greater than 0',
      path: ['price']
    }
  );

export const ticketsSchema = z.object({
  tickets: z.array(ticketSchema).min(1, 'Please add at least one ticket')
});

const promotionSchema = z
  .object({
    code: z.string().min(1, 'Please enter a promotion code'),
    type: z.enum(['PERCENTAGE', 'FIXED'], {
      required_error: 'Please select a promotion type',
      invalid_type_error: 'Please select a valid promotion type'
    }),
    amount: z
      .number()
      .min(0, 'Discount amount must be greater than or equal to 0'),
    maxUses: z
      .number()
      .min(1, 'Maximum uses must be at least 1')
      .max(1000, 'Maximum uses must be less than 1000'),
    startDate: z.date({
      required_error: 'Please select a start date'
    }),
    endDate: z.date({
      required_error: 'Please select an end date'
    })
  })
  .refine(
    (data) => {
      if (data.type === 'PERCENTAGE') {
        return data.amount <= 100;
      }
      return true;
    },
    {
      message: 'Percentage discount cannot be greater than 100%',
      path: ['amount']
    }
  )
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate']
    }
  );

export const promotionsSchema = z.object({
  promotion: promotionSchema
});

export const eventFormSchema = z.object({
  basicDetails: basicDetailsSchema,
  dateLocation: dateLocationSchema,
  tickets: ticketsSchema,
  promotions: promotionsSchema
});

export type EventFormData = z.infer<typeof eventFormSchema>;
