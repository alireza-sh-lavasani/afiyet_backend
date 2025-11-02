import { generatePatientIdInitials } from '@alireza-lavasani/afiyet-common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatientId, PatientIdDocument } from 'src/db/models/patient-id.model';

@Injectable()
export class PatientIdService {
  constructor(
    @InjectModel(PatientId.name)
    private patientIdModel: Model<PatientIdDocument>,
  ) {}

  /**************************************
   ******** Create Patient ID ************
   *************************************/
  async createPatientId(
    fullName: string,
    birthDateIso: string,
  ): Promise<PatientId> {
    // Get patient id initials
    const { namePart, dateKey } = generatePatientIdInitials(
      fullName,
      birthDateIso,
    );

    // Find the last sequence number for the given namePart and dateKey
    const lastPatientId = await this.patientIdModel
      .findOne({ namePart, dateKey })
      .sort({ sequenceNumber: -1 })
      .exec();

    // Determine the next sequence number
    const nextSequenceNumber = lastPatientId
      ? lastPatientId.sequenceNumber + 1
      : 1000;

    // Generate the unique patient ID
    const id = `${namePart}${dateKey}${nextSequenceNumber}`;

    // Create the new PatientId document
    const newPatientId = new this.patientIdModel({
      namePart,
      dateKey,
      id,
      sequenceNumber: nextSequenceNumber,
    });

    // Save the new PatientId document to the database
    return newPatientId.save();
  }

  /****************************************************
   ******** Create Patient ID from Temp ID ************
   ****************************************************/
  async createPatientIdFromTempId(tmpPatientId: string): Promise<PatientId> {
    const namePart = tmpPatientId.slice(0, 2); // Get the name part
    const dateKey = tmpPatientId.slice(2, 10); // Get the date key

    // Find the last sequence number for the given namePart and dateKey
    const lastPatientId = await this.patientIdModel
      .findOne({ namePart, dateKey })
      .sort({ sequenceNumber: -1 })
      .exec();

    // Determine the next sequence number
    const nextSequenceNumber = lastPatientId
      ? lastPatientId.sequenceNumber + 1
      : 1000;

    // Generate the unique patient ID
    const id = `${namePart}${dateKey}${nextSequenceNumber}`;

    // Create the new PatientId document
    const newPatientId = new this.patientIdModel({
      namePart,
      dateKey,
      id,
      sequenceNumber: nextSequenceNumber,
    });

    // Save the new PatientId document to the database
    return newPatientId.save();
  }
}
