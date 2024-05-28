import {
  generatePatientId,
  generateRandomSequenceNumber,
  padNumber,
} from '@aafiat/common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatientId, PatientIdDocument } from 'src/db/models/patient-id.model';

@Injectable()
export class PatientIdService {
  logger = new Logger(PatientIdService.name);

  constructor(
    @InjectModel(PatientId.name)
    private patientIdModel: Model<PatientIdDocument>,
  ) {}

  // Main function to generate a unique patient ID
  public async getPatientId(
    fullName: string,
    birthDateIso: string,
  ): Promise<string> {
    try {
      const { patientId, birthDatePart, sequenceNumber } = generatePatientId(
        fullName,
        birthDateIso,
      );

      // Save the generated patient ID to the database
      const newPatientId = new this.patientIdModel({
        id: patientId,
        dateKey: birthDatePart,
        sequenceNumber,
      });
      await newPatientId.save();

      return patientId;
    } catch (error) {
      this.logger.error(`Failed to generate patient ID`);
      this.logger.error(error.message);
      throw new InternalServerErrorException(`Failed to generate patient ID`);
    }
  }

  // Function to check and reassign patient IDs to avoid collisions
  public async checkAndReassignPatientIds(
    patientIds: string[],
  ): Promise<string[]> {
    try {
      const reassignedIds = [];

      for (let id of patientIds) {
        let exists = await this.patientIdModel.findOne({ id });
        while (exists) {
          const initials = id.slice(0, 2);
          const birthDatePart = id.slice(2, 10);
          const newSequenceNumber = generateRandomSequenceNumber(); // Generate a new random sequence number
          const newSequenceNumberPadded = padNumber(newSequenceNumber, 4); // Pad the sequence number
          id = `${initials}${birthDatePart}${newSequenceNumberPadded}`; // Construct a new patient ID
          exists = await this.patientIdModel.findOne({ id }); // Check if the new ID already exists
        }
        reassignedIds.push(id); // Add the unique ID to the reassigned list
      }

      return reassignedIds;
    } catch (error) {
      this.logger.error(`Failed to reassign patient IDs`);
      this.logger.error(error.message);
      throw new InternalServerErrorException(`Failed to reassign patient IDs`);
    }
  }
}
