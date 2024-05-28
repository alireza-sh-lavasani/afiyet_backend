import { z } from 'zod';
import { CreatePatientSchema } from './create-patient.dto';

// Params validation
export const UpdatePatientParamsSchema = z.string();

export type UpdatePatientParamsDto = z.infer<typeof UpdatePatientParamsSchema>;

// Body validation
export const UpdatePatientSchema = CreatePatientSchema.partial().strict();

export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;
