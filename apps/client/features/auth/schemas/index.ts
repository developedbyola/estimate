import { z } from 'zod';

export const nameSchema = z.object({
  name: z
    .string({ required_error: 'Enter your fullname' })
    .min(3, 'Name must be at least 3 characters'),
});

export const emailSchema = z.object({
  email: z
    .string({ required_error: 'Enter your email' })
    .email('Invalid email address'),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^\S*$/, 'Password cannot contain spaces')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[a-z]/, 'Must include at least one lowercase letter')
    .regex(/[0-9]/, 'Must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must include at least one special character'),
});
