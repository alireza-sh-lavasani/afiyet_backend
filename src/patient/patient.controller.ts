import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  CreatePatientSchema,
} from './dto/create-patient.dto';
import {
  UpdatePatientDto,
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
  @UsePipes(new ZodValidationPipe(CreatePatientSchema))
  async create(@Body() createPatientDto: CreatePatientDto): Promise<IPatient> {
    return await this.patientService.createPatient(createPatientDto);
  }

  /**************************************
   ******** Update Patient ***************
   *************************************/
  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdatePatientSchema))
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<IPatient> {
    try {
      return await this.patientService.updatePatient(id, updatePatientDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**************************************
   ******** Delete Patient ***************
   *************************************/
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IPatient> {
    try {
      return await this.patientService.deletePatient(id);
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
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IPatient> {
    try {
      return await this.patientService.getPatientById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
