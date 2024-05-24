import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IPatient } from '@aafiat/common';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export default class Patient implements IPatient {
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

  @Prop({ default: null, unique: true, index: true })
  uniqueGovID: string;

  @Prop({ type: [Types.ObjectId], ref: 'Examination', required: true })
  examinations: Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Create the unique index for uniqueGovID
PatientSchema.index({ uniqueGovID: 1 }, { unique: true });
