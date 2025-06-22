import { z } from 'zod';

export const currencySchema = z.object({
  currency: z.string(),
});
