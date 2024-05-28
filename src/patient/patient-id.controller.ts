import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { PatientIdService } from './patient-id.service';
import {
  CheckAndReassignDto,
  CheckAndReassignSchema,
  GeneratePatientIdDto,
  GeneratePatientIdSchema,
} from './dto/generate-patient-id.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('patient-id')
export class PatientIdController {
  constructor(private readonly patientIdService: PatientIdService) {}

  // Endpoint to generate a new patient ID
  @Post('generate')
  @UsePipes(new ZodValidationPipe(GeneratePatientIdSchema))
  async generatePatientId(@Body() body: GeneratePatientIdDto) {
    const { fullName, birthDateIso } = body;

    return await this.patientIdService.getPatientId(fullName, birthDateIso);
  }

  // Endpoint to check and reassign IDs to avoid collisions
  @Post('check-and-reassign')
  @UsePipes(new ZodValidationPipe(CheckAndReassignSchema))
  async checkAndReassign(@Body() body: CheckAndReassignDto) {
    return await this.patientIdService.checkAndReassignPatientIds(
      body.patientIds,
    );
  }
}
