import { PatientDocument } from 'src/db/models/patient.model';
import { CreateExaminationDto } from './dto/create-examination.dto';

export interface IRequestWithPatient extends Request {
  patient: PatientDocument;
}

// Either patientId or patient is required
export type ICreateExamination =
  | {
      examinationData: CreateExaminationDto;
      patientId: string;
      patient?: never;
    }
  | {
      examinationData: CreateExaminationDto;
      patientId?: never;
      patient: PatientDocument;
    };

export interface IGetPatientById {
  patientId: string;
  populate?: boolean;
}
