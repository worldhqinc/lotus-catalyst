import { z } from 'zod';

export const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  sku: z.string().min(1),
});
