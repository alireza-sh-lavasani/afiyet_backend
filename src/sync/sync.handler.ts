import { Injectable, Logger } from '@nestjs/common';
import {
  ISyncCreatePatientData,
  ISyncCreateExaminationDto,
  EIdType,
} from '@aafiat/common';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class SyncHandler {
  logger = new Logger(SyncHandler.name);

  constructor(private readonly patientService: PatientService) {}

  /********************************************
   ******** Handle Patient Create Sync ********
   ********************************************/
  async handlePatientCreateSync(data: ISyncCreatePatientData) {
    try {
      await this.patientService.createPatientWithTempId(data);

      this.logger.log('Patient created successfully');
    } catch (error) {
      this.logger.error('Error creating patient:', error);
      throw error;
    }
  }

  /************************************************
   ******** Handle Examination Create Sync ********
   ************************************************/
  async handleExaminationCreateSync(syncData: ISyncCreateExaminationDto) {
    const { data, metaData } = syncData;
    const { patientId, idType } = JSON.parse(metaData as unknown as string);

    try {
      switch (idType) {
        case EIdType.PERMANENT:
          await this.patientService.createExamination({
            patientId,
            examinationData: JSON.parse(data as unknown as string),
          });
          break;
        case EIdType.TEMP:
          // Fetch the patient by the temporary ID
          const patient =
            await this.patientService.getPatientByTempId(patientId);

          if (patient) {
            // Create the examination using the fetched patient
            await this.patientService.createExamination({
              patient,
              examinationData: JSON.parse(data as unknown as string),
            });
          }
      }

      this.logger.log('Examination created successfully');
    } catch (error) {
      this.logger.error('Error creating examination:', error);
      throw error;
    }
  }
}
