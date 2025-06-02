import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  constructor(private readonly configService: ConfigService) {}
  private s3 = new S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),

    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async uploadFile(file: Express.Multer.File) {
    const fileKey = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return { fileKey };
  }

  async downloadFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
      });

      const urlFile = await getSignedUrl(this.s3, command, { expiresIn: 60 }); // 60 seconds
      return { redirectUrl: urlFile };
    } catch (caught) {
      if (caught instanceof NoSuchKey) {
        console.error(
          `Error from S3 while getting object "${key}" from "${this.configService.getOrThrow('AWS_S3_BUCKET')}". No such key exists.`,
        );
      } else if (caught instanceof S3ServiceException) {
        console.error(
          `Error from S3 while getting object from ${this.configService.getOrThrow('AWS_S3_BUCKET')}.  ${caught.name}: ${caught.message}`,
        );
      } else {
        throw caught;
      }
    }
  }
}
