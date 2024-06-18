import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IExamination } from '@aafiat/common';
import { v4 as uuidv4 } from 'uuid';

export type ExaminationDocument = Document & Examination;

@Schema({ timestamps: true })
export class Examination implements IExamination {
  @Prop({ required: true, default: uuidv4() })
  examinationId: string;

  @Prop({ required: true, default: '' })
  zoba: string;

  @Prop({ required: true, default: '' })
  subZoba: string;

  @Prop({ required: true, default: '' })
  address: string;

  @Prop({ required: true, default: '' })
  bloodPressureDiastolic: string;

  @Prop({ required: true, default: '' })
  bloodPressureSystolic: string;

  @Prop({ required: true, default: '' })
  bloodSugar: string;

  @Prop({ required: true, default: '' })
  heartRate: string;

  @Prop({ required: true, default: '' })
  latitude: string;

  @Prop({ required: true, default: '' })
  localDistrict: string;

  @Prop({ required: true, default: '' })
  longitude: string;

  @Prop({ required: true, default: '' })
  oxygenSaturation: string;

  @Prop({ required: true, default: '' })
  respiratoryRate: string;

  @Prop({ required: true, default: '' })
  temperature: string;

  @Prop({ required: true, default: false })
  hasFever: boolean;

  @Prop({ required: true, default: false })
  hasHeadache: boolean;

  @Prop({ required: true, default: false })
  hasDizziness: boolean;

  @Prop({ required: true, default: false })
  hasNausea: boolean;

  @Prop({ required: true, default: false })
  hasFatigue: boolean;

  @Prop({ required: true, default: false })
  hasWeightLoss: boolean;

  @Prop({ required: true, default: false })
  hasSweating: boolean;

  @Prop({ required: true, default: false })
  hasCough: boolean;

  @Prop({ required: true, default: false })
  hasShortnessOfBreath: boolean;

  @Prop({ required: true, default: false })
  hasSoreThroat: boolean;

  @Prop({ required: true, default: false })
  hasChestPain: boolean;

  @Prop({ required: true, default: false })
  hasVomiting: boolean;

  @Prop({ required: true, default: false })
  hasDiarrhea: boolean;

  @Prop({ required: true, default: false })
  hasStomachPain: boolean;

  @Prop({ required: true, default: false })
  hasConstipation: boolean;

  @Prop({ required: true, default: false })
  hasAppetiteLoss: boolean;

  @Prop({ required: true, default: false })
  hasMusclePain: boolean;

  @Prop({ required: true, default: false })
  hasJointPain: boolean;

  @Prop({ required: true, default: false })
  hasBackPain: boolean;

  @Prop({ required: true, default: false })
  hasNeckPain: boolean;

  @Prop({ required: true, default: false })
  hasNumbness: boolean;

  @Prop({ required: true, default: false })
  hasSeizures: boolean;

  @Prop({ required: true, default: false })
  hasDifficultySpeaking: boolean;

  @Prop({ required: true, default: false })
  hasRash: boolean;

  @Prop({ required: true, default: false })
  hasItching: boolean;

  @Prop({ required: true, default: false })
  hasBruising: boolean;

  @Prop({ required: true, default: false })
  hasPainfulUrination: boolean;

  @Prop({ required: true, default: false })
  hasFrequentUrination: boolean;

  @Prop({ required: true, default: false })
  hasBloodInUrine: boolean;

  @Prop({ required: true, default: false })
  hasEarPain: boolean;

  @Prop({ required: true, default: false })
  hasHearingLoss: boolean;

  @Prop({ required: true, default: false })
  hasNasalCongestion: boolean;

  @Prop({ required: true, default: false })
  hasRunnyNose: boolean;

  @Prop({ required: true, default: false })
  hasSneezing: boolean;

  @Prop({ required: true, default: false })
  hasEyePain: boolean;

  @Prop({ required: true, default: false })
  hasRedEye: boolean;

  @Prop({ required: true, default: false })
  hasBlurredVision: boolean;

  @Prop({ required: true, default: false })
  hasVisionLoss: boolean;
}

export const ExaminationSchema = SchemaFactory.createForClass(Examination);
