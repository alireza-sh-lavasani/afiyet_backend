import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPatient } from '@aafiat/common';
import { Patient } from 'src/db/models/patient.model';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientIdService } from './patient-id.service';

@Injectable()
export class PatientService {
  logger = new Logger(PatientService.name);

  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<IPatient>,
    private readonly patientIdService: PatientIdService,
  ) {}

  /**************************************
   ******** Create Patient ***************
   *************************************/
  async createPatient(patientData: CreatePatientDto): Promise<IPatient> {
    try {
      // Generate a new patientID
      const patientId = await this.patientIdService.getPatientId(
        patientData.fullName,
        patientData.birthDate,
      );

      // Create a new patient with the generated patientID
      return await this.patientModel.create({
        ...patientData,
        patientID: patientId,
      });
    } catch (error) {
      this.logger.error(`Failed to create patient`);
      this.logger.error(error.message);

      throw new InternalServerErrorException(`Failed to create patient`);
    }
  }

  /**************************************
   ******** Update Patient ***************
   *************************************/
  async updatePatient(
    id: string,
    patientData: UpdatePatientDto,
  ): Promise<IPatient> {
    try {
      const patient = await this.patientModel.findById(id).exec(); // Find patient by id
      if (!patient) {
        throw new BadRequestException(`Patient with id: ${id} not found`);
      }

      // Update patient with new data
      Object.assign(patient, patientData);

      return await patient.save();
    } catch (error) {
      this.logger.error(`Failed to update patient with id: ${id}`);
      throw error;
    }
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
    try {
      const patient = await this.patientModel.findById(id).exec();
      if (!patient) {
        throw new BadRequestException(`Patient with id: ${id} not found`);
      }

      return patient;
    } catch (error) {
      this.logger.error(`Failed to get patient with id: ${id}`);
      this.logger.error(error.message);
      throw error;
    }
  }
}
