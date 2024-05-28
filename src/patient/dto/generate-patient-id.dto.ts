import { z } from 'zod';

export const GeneratePatientIdSchema = z.object({
  fullName: z.string(),
  birthDateIso: z.string(),
});

export type GeneratePatientIdDto = z.infer<typeof GeneratePatientIdSchema>;

export const CheckAndReassignSchema = z.object({
  patientIds: z.array(z.string()),
});

export type CheckAndReassignDto = z.infer<typeof CheckAndReassignSchema>;
