import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCallRequestSchema = z.object({
  outcomingNumber: z
    .string({ message: 'outcomingNumber must be a string' })
    .trim()
    .min(1, { message: 'outcomingNumber is required' }),
  receivingNumber: z
    .string({ message: 'receivingNumber must be a string' })
    .trim()
    .min(1, { message: 'receivingNumber is required' }),
});

export const callQueueRequestSchema = z.object({
  id: z.coerce
    .string({ message: 'id is required' })
    .trim()
    .min(1, { message: 'id is required' }),
  body: createCallRequestSchema,
});

export class CallQueueRequestDto extends createZodDto(callQueueRequestSchema) {}
