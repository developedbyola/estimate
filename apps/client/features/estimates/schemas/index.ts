import { z } from 'zod';

const calculationSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) >= 1, 'Minimum quantity is 1'),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) >= 0, 'Price cannot be less than 0'),
  type: z.enum(['income', 'expense']).default('expense'),
});

export const calculationsSchema = z.object({
  calculations: z
    .array(calculationSchema)
    .nonempty('At least one item is required'),
});

export type Calculation = z.infer<typeof calculationSchema>;
export type Calculations = z.infer<typeof calculationsSchema>;

export const estimateSchema = z.object({
  title: z.string().min(3, 'Estimate title is required'),
  farmId: z.string().uuid('Please select a valid farm'),
  calculations: z
    .array(calculationSchema)
    .nonempty('At least one item is required'),
});

export type EstimateSchema = z.infer<typeof estimateSchema>;
