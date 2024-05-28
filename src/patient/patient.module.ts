import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/db/models/patient.model';
import { PatientIdService } from './patient-id.service';
import { PatientId, PatientIdSchema } from 'src/db/models/patient-id.model';
import { PatientIdController } from './patient-id.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: PatientId.name, schema: PatientIdSchema },
    ]),
  ],
  controllers: [PatientController, PatientIdController],
  providers: [PatientService, PatientIdService],
})
export class PatientModule {}
