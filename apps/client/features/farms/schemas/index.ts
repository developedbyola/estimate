import { z } from 'zod';

export const farmSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .default('My farm'),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),

  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State cannot exceed 100 characters')
    .trim(),

  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address cannot exceed 255 characters')
    .trim(),

  categoryId: z.string().uuid('Please select a valid category'),

  size: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 1_000_000;
      },
      {
        message: 'Size must be a positive number less than 1,000,000',
      }
    )
    .default('1'),

  size_unit: z
    .enum(['hectare', 'acre'], {
      errorMap: () => ({ message: 'Size unit must be either hectare or acre' }),
    })
    .default('acre'),
});

export type FarmSchemaType = z.infer<typeof farmSchema>;
