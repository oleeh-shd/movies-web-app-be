import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AwsS3ConfigService } from 'src/custom-config/aws/aws-s3-config.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(awsConfigService: AwsS3ConfigService) {
    const { options, bucketName } = awsConfigService.getS3ConnectionOptions();

    this.client = new S3Client(options);
    this.bucketName = bucketName;
  }

  public async uploadFile(file: Buffer, key: string): Promise<void> {
    const mimeType = key.split('.')[1];

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
    });

    await this.client.send(command).catch((error) => {
      throw new BadRequestException(error);
    });
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.client, command, { expiresIn: 3600 }); // URL valid for 1 hour
      return url;
    } catch (error) {
      throw error;
    }
  }

  public async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.client.send(command);
    } catch (err) {
      throw new BadRequestException('Unable to delete resource');
    }
  }

  public async uploadPoster(file: Buffer, key: string) {
    return await this.uploadFile(file, key).then(() => key);
  }
}
