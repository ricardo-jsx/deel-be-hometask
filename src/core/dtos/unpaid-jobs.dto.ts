import { z } from 'zod';
import { contractResponseSchema } from './contract.dto';

const unpaidJobDbSchema = z.object({
  id: z.number(),
  description: z.string(),
  price: z.number(),
  paid: z.boolean(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
  paymentDate: z.date().nullable(),
  Contract: contractResponseSchema,
});

const unpaidJobResponseSchema = unpaidJobDbSchema.transform((contract) => ({
  id: contract.id,
  description: contract.description,
  price: contract.price,
  paid: contract.paid,
  paymentDate: contract.paymentDate,
  createdAt: contract.createdAt,
  updatedAt: contract.updatedAt,

  contractId: contract.Contract.id,
  contractTerms: contract.Contract.terms,
  contractStatus: contract.Contract.status,
}));

export const unpaidJobsResponseSchema = z.array(unpaidJobResponseSchema);

export type UnpaidJobResponseDTO = z.infer<typeof unpaidJobResponseSchema>;
export type UnpaidJobsResponseDTO = z.infer<typeof unpaidJobsResponseSchema>;