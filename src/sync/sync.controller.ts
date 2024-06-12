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

  @Post()
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

  // @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './sync-files',
  //       filename: (req, file, cb) => {
  //         const filename: string = path
  //           .parse(file.originalname)
  //           .name.replace(/\s/g, '');
  //         const extension: string = path.parse(file.originalname).ext;
  //         cb(null, `${filename}-${Date.now()}${extension}`);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (!file.mimetype.includes('zip')) {
  //         return cb(
  //           new BadRequestException('Only zip files are allowed!'),
  //           false,
  //         );
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log('file upload triggered');

  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }

  //   await this.syncService.writeSyncRecords(file);

  //   return {
  //     message: 'File uploaded successfully!',
  //     filename: file.filename,
  //   };
  // }

  // @Get('/download')
  // async downloadFile() {
  //   return { message: 'Download endpoint hit!' };
  // }
}
