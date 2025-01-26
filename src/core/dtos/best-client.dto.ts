import { z } from "zod";

const bestClientDbSchema = z.object({
  total_paid: z.number(),
  clientId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
})

const bestClientResponseSchema = bestClientDbSchema.transform(client => ({
  id: client.clientId,
  fullName: `${client.firstName} ${client.lastName}`,
  paid: client.total_paid,
}))

export const bestClientsResponseSchema = z.array(bestClientResponseSchema);

export type BestClientsResponse = z.infer<typeof bestClientsResponseSchema>;