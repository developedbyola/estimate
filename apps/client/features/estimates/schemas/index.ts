import { z } from 'zod';

const calculationItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) >= 0.01, 'Minimum quantity is 0.01'),
  unitPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) >= 0, 'Price cannot be negative'),
  operation: z.enum(['add', 'subtract']).default('add'),
  attachedTo: z.string().nullable(),
});

export const calculationSchema = z.object({
  calculations: z
    .array(calculationItemSchema)
    .nonempty('At least one item is required'),
});

export type Calculations = z.infer<typeof calculationSchema>;
export type CalculationItem = z.infer<typeof calculationItemSchema>;

export const estimateSchema = z.object({
  title: z.string().min(3, 'Name is required'),
  calculations: z
    .array(calculationItemSchema)
    .nonempty('At least one item is required'),
});
