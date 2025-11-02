import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { Request, Response } from 'express';
import pako from 'pako';
import { ISyncBaseDto } from '@alireza-lavasani/afiyet-common';
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('/buffer')
  async sync(@Req() req: Request, @Res() res: Response) {
    try {
      // Collect the incoming data as a buffer
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));

      req.on('end', async () => {
        const compressedBuffer = Buffer.concat(chunks); // Combine all chunks into a single buffer

        // Decompress the data using pako.inflate
        const decompressedData = pako.inflate(compressedBuffer, {
          to: 'string',
        });

        const originalData = JSON.parse(decompressedData); // Parse the decompressed data back to JSON

        await this.syncService.syncTabletToServer(
          originalData as ISyncBaseDto[],
        );

        const serverData = await this.syncService.syncServerToTablet(); // Get latest server data

        const jsonString = JSON.stringify(serverData); // Convert the JSON object to a string

        const compressedResponse = pako.deflate(jsonString); // Compress the response data using pako.deflate

        res.setHeader('Content-Type', 'application/octet-stream'); // Send the compressed data as binary
        res.send(Buffer.from(compressedResponse));
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      throw new InternalServerErrorException('Error syncing data');
    }
  }

  @Get('/latest-data')
  async getLatestData() {
    return await this.syncService.syncServerToTablet();
  }
}
