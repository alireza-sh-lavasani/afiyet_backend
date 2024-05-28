import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IPatient } from '@aafiat/common';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient implements IPatient {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ default: new Date().toISOString() })
  createdAt: Date;

  @Prop({ default: new Date().toISOString() })
  updatedAt: Date;

  @Prop({ required: true, default: null })
  education: string;

  @Prop({ required: true, default: null })
  emmergencyContact: string;

  @Prop({ required: true, default: null })
  fullName: string;

  @Prop({ required: true, default: null })
  gender: string;

  @Prop({ required: true, default: null })
  maritalStatus: string;

  @Prop({ default: null })
  uniqueGovID: string;

  @Prop({ type: [Types.ObjectId], ref: 'Examination', required: true })
  examinations: Types.ObjectId[];

  @Prop({ required: true, default: null, unique: true, index: true })
  birthDate: Date;

  @Prop({ required: true, default: null })
  patientId: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Create the unique index for patientId
PatientSchema.index({ patientId: 1 }, { unique: true });
