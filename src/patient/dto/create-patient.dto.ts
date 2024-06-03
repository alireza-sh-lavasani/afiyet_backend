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

// Zod Schema Definition
export const createPatientTmpIdSchema = z.object({
  tmpPatientId: z.string().regex(/^[A-Z]{2}\d{8}[0-9a-zA-Z]{7}$/), // The regex pattern for the temporary patient ID is similar to the actual patient ID with the exception of 7 random characters at the end
});

// Type to infer the Zod schema
export type CreatePatientTmpIdDto = z.infer<typeof createPatientTmpIdSchema>;
