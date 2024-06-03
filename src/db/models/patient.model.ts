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

  @Prop({ type: [Types.ObjectId], ref: 'Examination' })
  examinations: Types.ObjectId[];

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
