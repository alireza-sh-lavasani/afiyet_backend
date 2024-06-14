import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPatient, IExamination } from '@aafiat/common';
import { Patient, PatientDocument } from 'src/db/models/patient.model';
import { Model, MongooseError } from 'mongoose';
import {
  CreatePatientDto,
  CreatePatientTmpIdDto,
} from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientIdService } from './patient-id.service';
import { Examination } from 'src/db/models/examination.model';
import { ICreaetExamination } from './interfaces/create-examination.interface';

@Injectable()
export class PatientService {
  logger = new Logger(PatientService.name);

  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<IPatient>,
    @InjectModel(Examination.name)
    private readonly examinationModel: Model<IExamination>,
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
  async getAllPatients(): Promise<PatientDocument[]> {
    return (await this.patientModel.find().exec()) as PatientDocument[];
  }

  /**************************************
   ******** Get Patient By ID ***************
   *************************************/
  async getPatientById(patientId: string): Promise<PatientDocument> {
    try {
      const patient = (await this.patientModel
        .findOne({ patientId })
        .exec()) as PatientDocument;
      if (!patient) {
        throw new BadRequestException(
          `Patient with patientId: ${patientId} not found`,
        );
      }

      return patient;
    } catch (error) {
      this.logger.error(`Failed to get patient with patientId: ${patientId}`);

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw error;
    }
  }

  /**************************************
   ******** Create New Examination ******
   *************************************/
  async createExamination({
    examinationData,
    patientId,
    patient,
  }: ICreaetExamination): Promise<PatientDocument> {
    try {
      const newExamination =
        await this.examinationModel.create(examinationData); // Create a new examination

      // If patient is not provided, get the patient by patientId and add the new examination
      if (!patient) {
        const patient = await this.getPatientById(patientId);
        patient.examinations.push(newExamination);
        await patient.save();

        return patient;
      }

      // Add the new examination to the patient's examinations array
      patient.examinations.push(newExamination);
      await patient.save();

      return patient;
    } catch (error) {
      this.logger.error(
        `Failed to create examination for patient: ${patient.patientId}`,
      );

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw error;
    }
  }
}
