import { Injectable, Logger } from '@nestjs/common';
import {
  ISyncBaseDto,
  ESyncEntity,
  ESyncOperation,
  ISyncCreateExaminationDto,
} from '@aafiat/common';
import { SyncHandler } from './sync.handler';

@Injectable()
export class SyncService {
  logger = new Logger(SyncService.name);

  constructor(private readonly syncHandler: SyncHandler) {}

  /**************************************
   ******** Sync Tablet to Server ********
   *************************************/
  async syncTabletToServer(syncData: ISyncBaseDto[]) {
    for (const syncRecord of syncData) {
      const { entity } = syncRecord;

      try {
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
      } catch (error) {
        throw error;
      }
    }
  }

  /**************************************
   ******** Sync Server to Tablet ********
   *************************************/
  async syncServerToTablet() {}

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
