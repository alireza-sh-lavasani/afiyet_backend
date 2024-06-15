import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PatientModule } from 'src/patient/patient.module';
import { SyncHandler } from './sync.handler';

@Module({
  imports: [PatientModule],
  controllers: [SyncController],
  providers: [SyncService, SyncHandler],
})
export class SyncModule {}
