import { z } from 'zod';

export const nameSchema = z
  .string({
    required_error: 'Enter your fullname',
    invalid_type_error: 'Name must be a string',
  })
  .min(3, 'Name must be at least 3 characters');

export const emailSchema = z
  .string({
    required_error: 'Enter your email',
    invalid_type_error: 'Email must be a string',
  })
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^\S*$/, 'Password cannot contain spaces')
  .regex(/[A-Z]/, 'Must include at least one uppercase letter')
  .regex(/[a-z]/, 'Must include at least one lowercase letter')
  .regex(/[0-9]/, 'Must include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must include at least one special character');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
