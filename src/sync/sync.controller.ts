import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('sync')
export class SyncController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './sync-files',
        filename: (req, file, cb) => {
          const filename: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('zip')) {
          return cb(
            new BadRequestException('Only zip files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log(file);
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
    };
  }
}
