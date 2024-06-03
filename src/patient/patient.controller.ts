import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  CreatePatientSchema,
  CreatePatientTmpIdDto,
  createPatientTmpIdSchema,
} from './dto/create-patient.dto';
import {
  UpdatePatientDto,
  UpdatePatientParamsSchema,
  UpdatePatientSchema,
} from './dto/update-patient.dto';
import { IPatient } from '@aafiat/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**************************************
   ******** Create Patient ***************
   *************************************/
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreatePatientSchema))
    body: CreatePatientDto,
  ): Promise<IPatient> {
    return await this.patientService.createPatient(body);
  }

  /****************************************************
   ******** Create Patient with Temp ID ***************
   ****************************************************/
  @Post('/tmp-id')
  async createWithTempId(
    @Body(new ZodValidationPipe(createPatientTmpIdSchema))
    body: CreatePatientTmpIdDto,
  ): Promise<IPatient> {
    return await this.patientService.createPatientWithTempId(body);
  }

  /**************************************
   ******** Update Patient ***************
   *************************************/
  @Put(':patientId')
  async update(
    @Param('patientId', new ZodValidationPipe(UpdatePatientParamsSchema))
    patientId: string,
    @Body(new ZodValidationPipe(UpdatePatientSchema))
    updatePatientDto: UpdatePatientDto,
  ): Promise<IPatient> {
    try {
      return await this.patientService.updatePatient(
        patientId,
        updatePatientDto,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**************************************
   ******** Delete Patient ***************
   *************************************/
  @Delete(':patientId')
  async delete(@Param('patientId') patientId: string): Promise<IPatient> {
    try {
      return await this.patientService.deletePatient(patientId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**************************************
   ******** Get All Patients ***************
   *************************************/
  @Get()
  async findAll(): Promise<IPatient[]> {
    return await this.patientService.getAllPatients();
  }

  /**************************************
   ******** Get Patient By ID ***************
   *************************************/
  @Get(':patientId')
  async findOne(@Param('patientId') patientId: string): Promise<IPatient> {
    return await this.patientService.getPatientById(patientId);
  }
}
