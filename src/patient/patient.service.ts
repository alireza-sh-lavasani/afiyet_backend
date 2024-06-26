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
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientIdService } from './patient-id.service';
import { Examination } from 'src/db/models/examination.model';
import { ICreateExamination, IGetPatientById } from './patient.interfaces';

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
  async createPatientWithTempId(patientData: IPatient): Promise<IPatient> {
    const { tmpPatientId } = patientData;

    try {
      // Check if patient with temp ID already exists
      const patient = await this.getPatientByTempId(tmpPatientId);

      if (patient) {
        this.logger.log(`Patient with temp ID: ${tmpPatientId} already exists`);
        return patient;
      }
      // Generate a new patientId from the temp ID
      else {
        const { id: patientId } =
          await this.patientIdService.createPatientIdFromTempId(tmpPatientId);

        // Create a new patient
        const patient = await this.patientModel.create({
          ...patientData,
          patientId,
        });

        this.logger.log(
          `Patient with temp ID: ${patientData.tmpPatientId} created successfully.`,
        );

        return patient;
      }
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
    return await this.patientModel
      .find()
      .select('-_id -createdAt -updatedAt -__v')
      .lean();
  }

  /**************************************
   ******** Get Patient By ID ***************
   *************************************/
  async getPatientById({
    patientId,
    populate = false,
  }: IGetPatientById): Promise<PatientDocument> {
    try {
      let patient: PatientDocument;

      if (populate) {
        patient = (await this.patientModel
          .findOne({ patientId })
          .populate('examinations')
          .exec()) as PatientDocument;
      } else {
        patient = (await this.patientModel
          .findOne({ patientId })
          .exec()) as PatientDocument;
      }

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

  /***********************************************
   ******** Get Patient By Temp ID ***************
   **********************************************/
  async getPatientByTempId(tmpPatientId: string): Promise<PatientDocument> {
    try {
      const patient = (await this.patientModel
        .findOne({ tmpPatientId })
        .exec()) as PatientDocument;

      if (!patient) {
        this.logger.log(`Patient with tmpPatientId: ${tmpPatientId} not found`);
        return null;
      }

      return patient;
    } catch (error) {
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
  }: ICreateExamination): Promise<PatientDocument> {
    try {
      // Create a new examination
      const newExamination =
        await this.examinationModel.create(examinationData);

      // If patient is not provided, get the patient by patientId and add the new examination
      if (!patient) {
        const patient = await this.getPatientById({ patientId });
        patient.examinations.push(newExamination.examinationId);
        return await patient.save();
      }

      // Add the new examination to the patient's examinations array
      patient.examinations.push(newExamination.examinationId);
      return await patient.save();
    } catch (error) {
      this.logger.error(
        `Failed to create examination for patient: ${patient.patientId}`,
      );

      if (error instanceof MongooseError) this.logger.error(error.message);
      else this.logger.error(error);

      throw error;
    }
  }

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
