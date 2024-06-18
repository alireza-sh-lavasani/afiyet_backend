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
      return await this.patientService.createPatientWithTempId(data);
    } catch (error) {
      this.logger.error('Error syncing patient:', error);
      throw error;
    }
  }

  /************************************************
   ******** Handle Examination Create Sync ********
   ************************************************/
  async handleExaminationCreateSync(syncData: ISyncCreateExaminationDto) {
    const { data, metaData } = syncData;
    const { patientId, idType } = JSON.parse(metaData as unknown as string);
    const examinationData = JSON.parse(data as unknown as string);

    try {
      // Check if examination already exist
      const existingExamination = await this.patientService.getExaminationById(
        examinationData.examinationId,
      );

      if (existingExamination) {
        this.logger.log(
          `Examination with ID: ${examinationData.examinationId} already exists`,
        );
        return existingExamination;
      }

      switch (idType) {
        case EIdType.PERMANENT:
          await this.patientService.createExamination({
            patientId,
            examinationData,
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
              examinationData,
            });
          }
      }
    } catch (error) {
      this.logger.error('Error syncing examination:', error);
      throw error;
    }
  }
}
