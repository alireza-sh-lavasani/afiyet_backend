import { z } from 'zod';
import { CreatePatientSchema } from './create-patient.dto';

export const UpdatePatientSchema = CreatePatientSchema.partial().strict();

export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;
