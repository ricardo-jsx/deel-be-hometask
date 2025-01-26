import { z } from "zod";

const bestProfessionDbSchema = z.object({
  total_earned: z.number(),
  profession: z.string(),
})

export const bestProfessionResponseSchema = bestProfessionDbSchema.transform(profession => ({
  profession: profession.profession,
  totalEarned: profession.total_earned,
}))

export type BestProfessionResponse = z.infer<typeof bestProfessionResponseSchema>;
