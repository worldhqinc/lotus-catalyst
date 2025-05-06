import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
});
