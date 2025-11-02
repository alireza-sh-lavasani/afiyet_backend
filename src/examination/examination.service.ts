import { IExamination } from '@alireza-lavasani/afiyet-common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { Examination } from 'src/db/models/examination.model';

@Injectable()
export class ExaminationService {
  logger = new Logger(ExaminationService.name);

  constructor(
    @InjectModel(Examination.name)
    private readonly examinationModel: Model<IExamination>,
  ) {}

  /**************************************
   ******** Get all examinations
   *************************************/
  async getAllExaminations(): Promise<IExamination[]> {
    return await this.examinationModel
      .find()
      .select('-_id -createdAt -updatedAt -__v')
      .lean();
  }

  /**************************************
   ******** Get examination by id
   *************************************/
  async getExaminationById(examinationId: string): Promise<IExamination> {
    try {
      return await this.examinationModel.findOne({ examinationId }).lean();
    } catch (error) {
      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw error;
    }
  }
}
