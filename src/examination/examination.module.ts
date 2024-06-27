import { Module } from '@nestjs/common';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Examination,
  ExaminationSchema,
} from 'src/db/models/examination.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Examination.name, schema: ExaminationSchema },
    ]),
  ],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
