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
    syncData.forEach(async (syncRecord) => {
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
    });
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

    switch (operation) {
      // Handle patient create sync
      case ESyncOperation.CREATE:
        this.syncHandler.handlePatientCreateSync(JSON.parse(syncData.data));
        break;
    }
  }

  /**************************************
   ******** Handle Examination Sync ********
   *************************************/
  private async handleExaminationSync(syncData: ISyncCreateExaminationDto) {
    const { operation } = syncData;

    switch (operation) {
      // Handle examination create sync
      case ESyncOperation.CREATE:
        this.syncHandler.handleExaminationCreateSync(syncData);
        break;
    }
  }
}
