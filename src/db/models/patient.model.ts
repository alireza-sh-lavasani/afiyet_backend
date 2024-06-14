import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IPatient } from '@aafiat/common';
import { Examination } from './examination.model';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient implements IPatient {
  @Prop()
  education: string;

  @Prop()
  emmergencyContact: string;

  @Prop()
  fullName: string;

  @Prop()
  gender: string;

  @Prop()
  maritalStatus: string;

  @Prop()
  uniqueGovID: string;

  @Prop({ type: [{ type: [Types.ObjectId], ref: 'Examination' }] })
  examinations: Examination[];

  @Prop()
  birthDate: Date;

  @Prop({ default: null, unique: true, index: true })
  patientId: string;

  @Prop()
  tmpPatientId: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Create the unique index for patientId
PatientSchema.index({ patientId: 1 }, { unique: true });
