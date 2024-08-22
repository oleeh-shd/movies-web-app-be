import { Injectable } from '@nestjs/common';
import { S3ClientConfig } from '@aws-sdk/client-s3';

import { CustomConfigService } from '../custom-config.service';

@Injectable()
export class AwsS3ConfigService {
  private readonly options: S3ClientConfig;
  private readonly bucketName: string;

  constructor(configService: CustomConfigService) {
    this.bucketName = configService.get<string>('AWS_BUCKET_NAME');

    const region = configService.get<string>('AWS_S3_REGION');
    const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');

    this.options = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };
  }

  public getS3ConnectionOptions(): {
    options: S3ClientConfig;
    bucketName: string;
  } {
    return {
      options: this.options,
      bucketName: this.bucketName,
    };
  }
}
