import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { Request, Response } from 'express';
import pako from 'pako';
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('/buffer')
  async sync(@Req() req: Request, @Res() res: Response) {
    try {
      // Collect the incoming data as a buffer
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));

      req.on('end', () => {
        // Combine all chunks into a single buffer
        const compressedBuffer = Buffer.concat(chunks);

        // Decompress the data using pako.inflate
        const decompressedData = pako.inflate(compressedBuffer, {
          to: 'string',
        });

        // Parse the decompressed data back to JSON
        const originalData = JSON.parse(decompressedData);

        console.log('Received and decompressed data:', originalData);

        res.send('Data received and decompressed successfully');
      });
    } catch (error) {
      console.error('Error decompressing data:', error);
      throw new InternalServerErrorException('Error decompressing data');
    }
  }
}
