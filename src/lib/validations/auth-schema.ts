import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false)
});

export const userRegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10,12}$/, 'Please enter a valid phone number'),
  role: z.enum(['CUSTOMER', 'ORGANIZER'], {
    required_error: 'Please select a role'
  })
});

export const registerSchema = z.object({
  step1: z
    .object({
      fullName: userRegisterSchema.shape.fullName,
      email: userRegisterSchema.shape.email,
      password: userRegisterSchema.shape.password,
      confirmPassword: z.string().min(1, 'Please confirm your password')
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword']
    }),
  step2: z.object({
    phone: userRegisterSchema.shape.phone,
    role: userRegisterSchema.shape.role
  }),
  step3: z.object({
    referralCode: z.string().optional()
  })
});

export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;
export type UserRegisterRequest = z.infer<typeof userRegisterSchema>;