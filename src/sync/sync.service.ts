import { Injectable, Logger } from '@nestjs/common';
import {
  ISyncBaseDto,
  ESyncEntity,
  ESyncOperation,
  ISyncCreateExaminationDto,
} from '@aafiat/common';
import { SyncHandler } from './sync.handler';
import { PatientService } from 'src/patient/patient.service';
import { ExaminationService } from 'src/examination/examination.service';

@Injectable()
export class SyncService {
  logger = new Logger(SyncService.name);

  constructor(
    private readonly syncHandler: SyncHandler,
    private readonly patientService: PatientService,
    private readonly examinationService: ExaminationService,
  ) {}

  /**************************************
   ******** Sync Tablet to Server ********
   *************************************/
  async syncTabletToServer(syncData: ISyncBaseDto[]) {
    try {
      for (const syncRecord of syncData) {
        const { entity } = syncRecord;

        switch (entity) {
          // Handle patient sync
          case ESyncEntity.PATIENT:
            await this.handlePatientSync(syncRecord);
            break;

          // Handle examination sync
          case ESyncEntity.EXAMINATION:
            await this.handleExaminationSync(
              syncRecord as ISyncCreateExaminationDto,
            );
            break;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**************************************
   ******** Sync Server to Tablet ********
   *************************************/
  async syncServerToTablet() {
    const patientsPromise = this.patientService.getAllPatients();
    const examinationsPromise = this.examinationService.getAllExaminations();

    const [patients, examinations] = await Promise.all([
      patientsPromise,
      examinationsPromise,
    ]);

    return { patients, examinations };
  }

  /**************************************
   ******** Handle Patient Sync ********
   *************************************/
  private async handlePatientSync(syncData: ISyncBaseDto) {
    const { operation } = syncData;

    try {
      switch (operation) {
        // Handle patient create sync
        case ESyncOperation.CREATE:
          await this.syncHandler.handlePatientCreateSync(
            JSON.parse(syncData.data),
          );
          break;
      }
    } catch (error) {
      throw error;
    }
  }

  /**************************************
   ******** Handle Examination Sync ********
   *************************************/
  private async handleExaminationSync(syncData: ISyncCreateExaminationDto) {
    const { operation } = syncData;

    try {
      switch (operation) {
        // Handle examination create sync
        case ESyncOperation.CREATE:
          await this.syncHandler.handleExaminationCreateSync(syncData);
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
