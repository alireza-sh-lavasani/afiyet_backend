import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { PatientId, PatientIdDocument } from 'src/db/models/patient-id.model';

@Injectable()
export class PatientIdService {
  logger = new Logger(PatientIdService.name);

  constructor(
    @InjectModel(PatientId.name)
    private patientIdModel: Model<PatientIdDocument>,
  ) {}

  // Helper function to pad a number with leading zeros
  private padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }

  // Helper function to extract initials from a full name
  private extractInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials =
      nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : fullName.slice(0, 2).toUpperCase();
    return initials;
  }

  // Function to generate a 4-digit random sequence number
  private generateRandomSequenceNumber(): number {
    return Math.floor(Math.random() * 10000); // 4-digit random number between 0000 and 9999
  }

  // Main function to generate a unique patient ID
  public async generatePatientId(
    fullName: string,
    birthDateIso: string,
  ): Promise<string> {
    try {
      const initials = this.extractInitials(fullName); // Extract initials from full name
      const birthDatePart = moment(birthDateIso).format('YYYYMMDD'); // Format birthdate as YYYYMMDD
      const sequenceNumber = this.generateRandomSequenceNumber(); // Generate random sequence number
      const sequenceNumberPadded = this.padNumber(sequenceNumber, 4); // Pad sequence number to 4 digits
      const patientId = `${initials}${birthDatePart}${sequenceNumberPadded}`; // Construct patient ID

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
          const newSequenceNumber = this.generateRandomSequenceNumber(); // Generate a new random sequence number
          const newSequenceNumberPadded = this.padNumber(newSequenceNumber, 4); // Pad the sequence number
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
