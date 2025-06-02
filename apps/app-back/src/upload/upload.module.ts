import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AwsS3Service } from './upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UploadController],
  providers: [AwsS3Service],
})
export class UploadModule {}
