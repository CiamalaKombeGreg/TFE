import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from './upload.service';
import * as multer from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.awsS3Service.uploadFile(file);
  }

  @Get(':id')
  async downloadFile(@Param('id') id: string) {
    return this.awsS3Service.downloadFile(id);
  }
}
