import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Type definition for a PatientId document
export type PatientIdDocument = PatientId & Document;

// Mongoose schema for PatientId
@Schema()
export class PatientId {
  @Prop({ required: true }) // The name part is required
  namePart: string;

  @Prop({ required: true }) // The date key (formatted birthdate) is required
  dateKey: string;

  @Prop({ required: true, unique: true }) // The patient ID must be unique and is required
  id: string;

  @Prop({ required: true }) // The sequence number is required
  sequenceNumber: number;
}

// Create a Mongoose schema for the PatientId class
export const PatientIdSchema = SchemaFactory.createForClass(PatientId);
