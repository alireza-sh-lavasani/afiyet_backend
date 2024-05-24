import mongoose, { Schema, Document } from 'mongoose';
import { IExamination } from '@aafiat/common';

// We define the IExaminationModel interface that extends both IExamination and mongoose.Document.
// This allows us to have access to Mongoose document methods and properties.
interface IExaminationModel extends IExamination, Document {
  _id: mongoose.Types.ObjectId;
}

const examinationSchema = new Schema<IExaminationModel>({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  zoba: { type: String, required: true, default: '' },
  subZoba: { type: String, required: true, default: '' },
  address: { type: String, required: true, default: '' },
  bloodPressureDiastolic: { type: String, required: true, default: '' },
  bloodPressureSystolic: { type: String, required: true, default: '' },
  bloodSugar: { type: String, required: true, default: '' },
  heartRate: { type: String, required: true, default: '' },
  latitude: { type: String, required: true, default: '' },
  localDistrict: { type: String, required: true, default: '' },
  longitude: { type: String, required: true, default: '' },
  oxygenSaturation: { type: String, required: true, default: '' },
  respiratoryRate: { type: String, required: true, default: '' },
  temperature: { type: String, required: true, default: '' },
  hasFever: { type: Boolean, required: true, default: false },
  hasHeadache: { type: Boolean, required: true, default: false },
  hasDizziness: { type: Boolean, required: true, default: false },
  hasNausea: { type: Boolean, required: true, default: false },
  hasFatigue: { type: Boolean, required: true, default: false },
  hasWeightLoss: { type: Boolean, required: true, default: false },
  hasSweating: { type: Boolean, required: true, default: false },
  hasCough: { type: Boolean, required: true, default: false },
  hasShortnessOfBreath: { type: Boolean, required: true, default: false },
  hasSoreThroat: { type: Boolean, required: true, default: false },
  hasChestPain: { type: Boolean, required: true, default: false },
  hasVomiting: { type: Boolean, required: true, default: false },
  hasDiarrhea: { type: Boolean, required: true, default: false },
  hasStomachPain: { type: Boolean, required: true, default: false },
  hasConstipation: { type: Boolean, required: true, default: false },
  hasAppetiteLoss: { type: Boolean, required: true, default: false },
  hasMusclePain: { type: Boolean, required: true, default: false },
  hasJointPain: { type: Boolean, required: true, default: false },
  hasBackPain: { type: Boolean, required: true, default: false },
  hasNeckPain: { type: Boolean, required: true, default: false },
  hasNumbness: { type: Boolean, required: true, default: false },
  hasSeizures: { type: Boolean, required: true, default: false },
  hasDifficultySpeaking: { type: Boolean, required: true, default: false },
  hasRash: { type: Boolean, required: true, default: false },
  hasItching: { type: Boolean, required: true, default: false },
  hasBruising: { type: Boolean, required: true, default: false },
  hasPainfulUrination: { type: Boolean, required: true, default: false },
  hasFrequentUrination: { type: Boolean, required: true, default: false },
  hasBloodInUrine: { type: Boolean, required: true, default: false },
  hasEarPain: { type: Boolean, required: true, default: false },
  hasHearingLoss: { type: Boolean, required: true, default: false },
  hasNasalCongestion: { type: Boolean, required: true, default: false },
  hasRunnyNose: { type: Boolean, required: true, default: false },
  hasSneezing: { type: Boolean, required: true, default: false },
  hasEyePain: { type: Boolean, required: true, default: false },
  hasRedEye: { type: Boolean, required: true, default: false },
  hasBlurredVision: { type: Boolean, required: true, default: false },
  hasVisionLoss: { type: Boolean, required: true, default: false },
});

const ExaminationModel = mongoose.model<IExaminationModel>(
  'Examination',
  examinationSchema,
);

export default ExaminationModel;
