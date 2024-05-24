import { z } from 'zod';

export const CreatePatientSchema = z
  .object({
    education: z.string(),
    emmergencyContact: z.string(),
    fullName: z.string(),
    gender: z.string(),
    maritalStatus: z.string(),
    uniqueGovID: z.string().nullable().optional(),
  })
  .strict();

export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
