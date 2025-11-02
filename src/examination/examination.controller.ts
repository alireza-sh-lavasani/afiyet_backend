import { Controller, Get, Param } from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { IExamination } from '@alireza-lavasani/afiyet-common';

@Controller('examination')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  /**************************************
   ******** Get Examination By ID ***************
   *************************************/
  @Get(':examinationId')
  async findOne(
    @Param('examinationId') examinationId: string,
  ): Promise<IExamination> {
    return await this.examinationService.getExaminationById(examinationId);
  }
}
