import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { PatientService } from '../patient.service';

@Injectable()
export class PatientExistsGuard implements CanActivate {
  constructor(private readonly patientService: PatientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const patientId = request.params.patientId;

    if (!patientId) {
      throw new BadRequestException('Patient ID is missing');
    }

    const patient = await this.patientService.getPatientById({ patientId });

    request.patient = patient;

    // Patient exists, allow access
    return true;
  }
}
