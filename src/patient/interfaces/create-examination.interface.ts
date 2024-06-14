import { PatientDocument } from 'src/db/models/patient.model';
import { CreateExaminationDto } from '../dto/create-examination.dto';

export interface ICreaetExamination {
  examinationData: CreateExaminationDto;
  patientId?: string;
  patient?: PatientDocument;
}
