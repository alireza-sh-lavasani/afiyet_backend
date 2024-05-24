import { Schema, model, Types } from 'mongoose';
import { IPatient } from '@aafiat/common';

export const patientSchema = new Schema<IPatient>({
  _id: {
    type: Schema.Types.ObjectId,
    default: new Types.ObjectId(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  education: {
    type: String,
    required: true,
    default: null,
  },
  emmergencyContact: {
    type: String,
    required: true,
    default: null,
  },
  fullName: {
    type: String,
    required: true,
    default: null,
  },
  gender: {
    type: String,
    required: true,
    default: null,
  },
  maritalStatus: {
    type: String,
    required: true,
    default: null,
  },
  uniqueGovID: {
    type: String,
    required: false,
    default: null,
    unique: true,
  },
  examinations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Examination',
      required: true,
    },
  ],
});

const Patient = model<IPatient>('Patient', patientSchema);

export default Patient;
