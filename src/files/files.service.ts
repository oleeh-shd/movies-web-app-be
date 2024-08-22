import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { FileRepository } from './repositories/public-file.repository';
import { v4 } from 'uuid';
import { FileEntity } from './entities/file.entity';
import { FileTypeEnum } from './enums/file-type.enum';
import { isNil } from 'lodash';

@Injectable()
export class FilesService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly fileRepository: FileRepository,
  ) {}

  public async createFile(file: Express.Multer.File): Promise<number> {
    const mimeType = this.getMimeType(file);

    const key = this.generateFileKey(mimeType);

    const { id } = await this.awsS3Service
      .uploadPoster(file.buffer, key)
      .then(async (key) => {
        return await this.fileRepository.save({
          key,
          type: FileTypeEnum[mimeType.toUpperCase()],
        });
      });

    return id;
  }

  public async getFileByKey(key: string): Promise<string> {
    return this.awsS3Service.getPresignedUrl(key);
  }

  public async deleteFile(id: number): Promise<void> {
    const publicFile = await this.isExistsFile(id);

    await this.awsS3Service.deleteFile(publicFile.key);

    await this.fileRepository.remove(publicFile);
  }

  public async getFileById(id: number): Promise<FileEntity> {
    return this.fileRepository.findOne({
      where: { id },
    });
  }

  public async isExistsFile(id: number): Promise<FileEntity> {
    const file = await this.getFileById(id);

    if (isNil(file)) throw new NotFoundException('FileNotFound');

    return file;
  }

  private getMimeType(file: Express.Multer.File): string {
    return file.mimetype.split('/')[1];
  }

  private generateFileKey(mimeType: string) {
    return `${v4()}.${mimeType}`;
  }
}
