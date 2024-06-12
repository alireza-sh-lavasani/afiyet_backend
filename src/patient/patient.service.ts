import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPatient } from '@aafiat/common';
import { Patient } from 'src/db/models/patient.model';
import { Model, MongooseError } from 'mongoose';
import {
  CreatePatientDto,
  CreatePatientTmpIdDto,
} from './dto/create-patient.dto';
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
      // Generate a new patientId
      const patientId = await this.patientIdService.createPatientId(
        patientData.fullName,
        patientData.birthDate,
      );

      // Create a new patient with the generated patientId
      return await this.patientModel.create({
        ...patientData,
        patientId: patientId.id,
      });
    } catch (error) {
      this.logger.error(`Failed to create patient`);

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw new InternalServerErrorException(`Failed to create patient`);
    }
  }

  /****************************************************
   ******** Create Patient with Temp ID ***************
   ****************************************************/
  async createPatientWithTempId(
    patientData: CreatePatientTmpIdDto,
  ): Promise<IPatient> {
    const { tmpPatientId } = patientData;

    try {
      // Generate a new patientId
      const { id: patientId } =
        await this.patientIdService.createPatientIdFromTempId(tmpPatientId);

      // Create a new patient with the temporary patientId
      return await this.patientModel.create({
        patientId,
        tmpPatientId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create patient with temp ID: ${patientData.tmpPatientId}`,
      );

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw new InternalServerErrorException(
        `Failed to create patient with temp ID: ${patientData.tmpPatientId}`,
      );
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

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw error;
    }
  }
}
