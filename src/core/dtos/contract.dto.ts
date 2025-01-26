import { z } from 'zod';

export const contractResponseSchema = z.object({
  id: z.number(),
  terms: z.string(),
  status: z.enum(['new','in_progress','terminated']),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
  ContractorId: z.number(),
  ClientId: z.number(),
});

export const contractsResponseSchema = z.array(contractResponseSchema);

export type ContractResponseDTO = z.infer<typeof contractResponseSchema>;
export type ContractsResponseDTO = z.infer<typeof contractsResponseSchema>;