import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import Patient, { patientSchema } from 'src/db/models/patient.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: patientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
