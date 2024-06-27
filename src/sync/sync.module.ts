import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PatientModule } from 'src/patient/patient.module';
import { SyncHandler } from './sync.handler';
import { ExaminationModule } from 'src/examination/examination.module';

@Module({
  imports: [PatientModule, ExaminationModule],
  controllers: [SyncController],
  providers: [SyncService, SyncHandler],
})
export class SyncModule {}
