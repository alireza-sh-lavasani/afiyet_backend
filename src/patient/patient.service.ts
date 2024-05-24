import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPatient } from '@aafiat/common';
import Patient from 'src/db/models/patient.model';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  logger = new Logger(PatientService.name);

  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<IPatient>,
  ) {}

  /**************************************
   ******** Create Patient ***************
   *************************************/
  async createPatient(patientData: CreatePatientDto): Promise<IPatient> {
    try {
      const newPatient = new this.patientModel(patientData);
      return await newPatient.save();
    } catch (error) {
      this.logger.error(`${PatientService.name} - Failed to create patient`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**************************************
   ******** Update Patient ***************
   *************************************/
  async updatePatient(
    id: string,
    patientData: UpdatePatientDto,
  ): Promise<IPatient> {
    return await this.patientModel.findByIdAndUpdate(id, patientData, {
      new: true,
    });
  }

  /**************************************
   ******** Delete Patient ***************
   *************************************/
  async deletePatient(id: string): Promise<IPatient> {
    return await this.patientModel.findByIdAndDelete(id);
  }

  /**************************************
   ******** Get All Patients ***************
   *************************************/
  async getAllPatients(): Promise<IPatient[]> {
    return await this.patientModel.find().exec();
  }

  /**************************************
   ******** Get Patient By ID ***************
   *************************************/
  async getPatientById(id: string): Promise<IPatient> {
    return await this.patientModel.findById(id).exec();
  }
}
