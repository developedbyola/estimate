import { z } from 'zod';

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
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const onboardSchema = z.object({
  lastName: z.string().min(1, 'What is your last name?'),
  firstName: z.string().min(1, 'What is your first name?'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z]/, 'Username must start with a letter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, and hyphens are allowed')
    .regex(/^((?!__).)*$/, 'Username cannot contain consecutive underscores')
    .regex(/^((?!--).)*$/, 'Username cannot contain consecutive hyphens')
    .regex(/^[^_].*[^_]$/, 'Username cannot start or end with an underscore or hyphen'),
});
