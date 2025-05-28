import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  sku: z.string().min(1),
});
