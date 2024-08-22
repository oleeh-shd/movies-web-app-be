import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { FileRepository } from './repositories/public-file.repository';

@Module({
  imports: [AwsS3Module],
  providers: [FilesService, FileRepository],
})
export class FilesModule {}
