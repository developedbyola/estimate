import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string({
      required_error: 'Category title is required.',
      invalid_type_error: 'Category title must be a string.',
    })
    .min(3, 'Title must be at least 3 characters long.'),

  icon: z.string({
    required_error: 'An icon is required for the category.',
    invalid_type_error: 'Icon must be a string.',
  }),
});
