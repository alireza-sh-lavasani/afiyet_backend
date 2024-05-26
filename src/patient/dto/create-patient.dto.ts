import { z } from 'zod';

// Zod Schema Definition
export const CreatePatientSchema = z
  .object({
    education: z.string().optional(),
    emmergencyContact: z.string().optional(),
    fullName: z.string(),
    gender: z.string(),
    maritalStatus: z.string(),
    uniqueGovID: z.string().nullable().optional(),
    birthDate: z.string(),
  })
  .strict();

// Type to infer the Zod schema
export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
