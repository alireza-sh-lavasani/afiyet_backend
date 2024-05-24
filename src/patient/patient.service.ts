import {
  BadRequestException,
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
    // If patientData includes uniqueGovID, check if it already exists
    if (patientData.uniqueGovID) {
      const patient = await this.patientModel.findOne({
        uniqueGovID: patientData.uniqueGovID,
      });
      // If patient with uniqueGovID already exists, throw an error
      if (patient) {
        this.logger.error(
          `Patient with uniqueGovID: ${patientData.uniqueGovID} already exists`,
        );

        throw new BadRequestException(
          `Patient with uniqueGovID: ${patientData.uniqueGovID} already exists`,
        );
      }
      // Create a new patient
      else {
        try {
          return await this.patientModel.create(patientData);
        } catch (error) {
          this.logger.error(`Failed to create patient`);
          this.logger.error(error.message);

          throw new InternalServerErrorException(`Failed to create patient`);
        }
      }
    }
    // Otherwise, create a new patient
    else {
      try {
        return await this.patientModel.create(patientData);
      } catch (error) {
        this.logger.error(`Failed to create patient`);
        this.logger.error(error.message);

        throw new InternalServerErrorException(`Failed to create patient`);
      }
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
