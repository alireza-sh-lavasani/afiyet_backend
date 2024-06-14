import { PatientDocument } from 'src/db/models/patient.model';

export interface IRequestWithPatient extends Request {
  patient: PatientDocument;
}
